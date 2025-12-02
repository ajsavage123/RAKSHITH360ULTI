export interface Location {
  lat: number;
  lng: number;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  distance?: string;
  openingHours?: string;
}

export interface GeocodeResult {
  lat: number;
  lon: number;
}

// Helper function to get API key (priority: localStorage > environment variable)
const getGeoapifyApiKey = (): string => {
  // Try to get from localStorage first (user-saved key)
  try {
    const savedKey = localStorage.getItem('api_key_geoapify');
    if (savedKey) {
      return savedKey;
    }
  } catch (error) {
    console.warn('Error reading Geoapify API key from localStorage:', error);
  }
  
  // Fallback to environment variable
  const envKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
  if (envKey) {
    return envKey;
  }
  
  return 'YOUR_API_KEY_HERE';
};

const GEOAPIFY_API_KEY = getGeoapifyApiKey();

// If using placeholder, show instructions
if (GEOAPIFY_API_KEY === 'YOUR_API_KEY_HERE') {
  console.warn('⚠️ Please add your Geoapify API key in Account Settings or .env file: VITE_GEOAPIFY_API_KEY=your_actual_api_key');
  console.warn('📝 Get free API key from: https://www.geoapify.com/');
}

class GeoapifyService {
  private apiKey: string;

  constructor() {
    this.apiKey = GEOAPIFY_API_KEY;
  }

  // Method to get current API key (checks localStorage and env)
  private getApiKey(): string {
    try {
      const savedKey = localStorage.getItem('api_key_geoapify');
      if (savedKey) {
        return savedKey;
      }
    } catch (error) {
      console.warn('Error reading Geoapify API key from localStorage:', error);
    }
    
    const envKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    if (envKey) {
      return envKey;
    }
    
    return this.apiKey;
  }

  private async makeRequest(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async searchHospitals(location: Location, specialty?: string): Promise<Hospital[]> {
    const hospitals: Hospital[] = [];
    const searchRadius = 15000; // 15km radius

    try {
      // Method 1: Try Geoapify Places API first
      const currentApiKey = this.getApiKey();
      if (currentApiKey && currentApiKey !== 'YOUR_API_KEY_HERE') {
        try {
          const query = specialty ? `hospital ${specialty}` : 'hospital';
          const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=rect:${location.lng - 0.1},${location.lat - 0.1},${location.lng + 0.1},${location.lat + 0.1}&limit=50&apiKey=${currentApiKey}`;
          
          const data = await this.makeRequest(url);
          
          if (data.features) {
            data.features.forEach((feature: any) => {
              const properties = feature.properties;
              const distance = this.calculateDistance(location, {
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0]
              });
              
              if (distance <= searchRadius) {
                hospitals.push({
                  id: feature.properties.place_id || `geoapify_${Date.now()}_${Math.random()}`,
                  name: properties.name || 'Unknown Hospital',
                  address: properties.formatted || properties.address_line1 || 'Address not available',
                  phone: properties.phone || 'Phone not available',
                  rating: properties.rating || 0,
                  distance: this.formatDistance(distance),
                  openingHours: properties.opening_hours || 'Hours not available'
                });
              }
            });
          }
        } catch (error) {
          console.warn('Geoapify Places API failed, trying OpenStreetMap:', error);
        }
      }

      // Method 2: OpenStreetMap Overpass API as fallback
      if (hospitals.length === 0) {
        try {
          const query = `
            [out:json][timeout:25];
            (
              node["amenity"="hospital"](around:${searchRadius},${location.lat},${location.lng});
              way["amenity"="hospital"](around:${searchRadius},${location.lat},${location.lng});
              relation["amenity"="hospital"](around:${searchRadius},${location.lat},${location.lng});
            );
            out body;
            >;
            out skel qt;
          `;
          
          const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
          const data = await this.makeRequest(url);
          
          if (data.elements) {
            data.elements.forEach((element: any) => {
              if (element.tags && element.tags.amenity === 'hospital') {
                const distance = this.calculateDistance(location, {
                  lat: element.lat || element.center?.lat,
                  lng: element.lon || element.center?.lon
                });
                
                if (distance <= searchRadius) {
                  hospitals.push({
                    id: `osm_${element.id}`,
                    name: element.tags.name || element.tags['name:en'] || 'Unknown Hospital',
                    address: element.tags['addr:street'] ? 
                      `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street']}, ${element.tags['addr:city'] || ''}`.trim() : 
                      'Address not available',
                    phone: element.tags.phone || element.tags['contact:phone'] || 'Phone not available',
                    rating: 0,
                    distance: this.formatDistance(distance),
                    openingHours: element.tags.opening_hours || 'Hours not available'
                  });
                }
              }
            });
          }
        } catch (error) {
          console.warn('OpenStreetMap API failed:', error);
        }
      }

      // Method 3: Additional search using Nominatim if still no results
      if (hospitals.length === 0) {
        try {
          const searchQuery = specialty ? `hospital ${specialty}` : 'hospital';
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=20&addressdetails=1&viewbox=${location.lng - 0.1},${location.lat + 0.1},${location.lng + 0.1},${location.lat - 0.1}&bounded=1`;
          
          const data = await this.makeRequest(url);
          
          data.forEach((place: any) => {
            if (place.type === 'hospital' || place.class === 'amenity') {
              const distance = this.calculateDistance(location, {
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon)
              });
              
              if (distance <= searchRadius) {
                hospitals.push({
                  id: `nominatim_${place.place_id}`,
                  name: place.display_name.split(',')[0] || 'Unknown Hospital',
                  address: place.display_name || 'Address not available',
                  phone: 'Phone not available',
                  rating: 0,
                  distance: this.formatDistance(distance),
                  openingHours: 'Hours not available'
                });
              }
            }
          });
        } catch (error) {
          console.warn('Nominatim search failed:', error);
        }
      }

    } catch (error) {
      console.error('All hospital search methods failed:', error);
      throw new Error('Failed to fetch hospital data');
    }

    return hospitals;
  }

  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    try {
      // Try Geoapify Geocoding first
      const currentApiKey = this.getApiKey();
      if (currentApiKey && currentApiKey !== 'YOUR_API_KEY_HERE') {
        try {
          const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${currentApiKey}`;
          const data = await this.makeRequest(url);
          
          if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            return {
              lat: feature.geometry.coordinates[1],
              lon: feature.geometry.coordinates[0]
            };
          }
        } catch (error) {
          console.warn('Geoapify geocoding failed, trying Nominatim:', error);
        }
      }

      // Fallback to Nominatim
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
      const data = await this.makeRequest(url);
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  }

  async getLocationName(location: Location): Promise<string> {
    try {
      // Try Geoapify Reverse Geocoding first
      const currentApiKey = this.getApiKey();
      if (currentApiKey && currentApiKey !== 'YOUR_API_KEY_HERE') {
        try {
          const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lng}&apiKey=${currentApiKey}`;
          const data = await this.makeRequest(url);
          
          if (data.features && data.features.length > 0) {
            const properties = data.features[0].properties;
            return properties.city || properties.town || properties.village || properties.county || 'Unknown location';
          }
        } catch (error) {
          console.warn('Geoapify reverse geocoding failed, trying Nominatim:', error);
        }
      }

      // Fallback to Nominatim
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`;
      const data = await this.makeRequest(url);
      
      if (data.address) {
        return data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown location';
      }
      
      return 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return 'Unknown location';
    }
  }

  private calculateDistance(point1: Location, point2: Location): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  }
}

export const geoapifyService = new GeoapifyService(); 