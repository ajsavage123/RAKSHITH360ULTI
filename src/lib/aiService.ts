import { storageService } from './storage';

export type AIModel = 'gemini' | 'deepseek' | 'openai';

export interface AIModelConfig {
  id: AIModel;
  name: string;
  apiKeyName: string;
  models: string[];
}

export const AI_MODELS: Record<AIModel, AIModelConfig> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    apiKeyName: 'gemini',
    models: ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash-exp', 'gemini-pro']
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    apiKeyName: 'deepseek',
    models: ['deepseek-chat', 'deepseek-coder']
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    apiKeyName: 'openai',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']
  }
};

// Get API key for a provider
export const getApiKey = (provider: AIModel): string | null => {
  const config = AI_MODELS[provider];
  if (!config) return null;
  
  // Try localStorage first
  const savedKey = storageService.getApiKey(config.apiKeyName);
  if (savedKey) return savedKey;
  
  // Fallback to environment variable
  const envKey = import.meta.env[`VITE_${config.apiKeyName.toUpperCase()}_API_KEY`];
  return envKey || null;
};

// Get selected model preference
export const getSelectedModel = (): AIModel => {
  try {
    const saved = localStorage.getItem('selected_ai_model');
    if (saved && (saved === 'gemini' || saved === 'deepseek' || saved === 'openai')) {
      return saved as AIModel;
    }
  } catch (error) {
    console.error('Error loading selected model:', error);
  }
  return 'gemini'; // Default to Gemini
};

// Save selected model preference
export const saveSelectedModel = (model: AIModel): void => {
  try {
    localStorage.setItem('selected_ai_model', model);
  } catch (error) {
    console.error('Error saving selected model:', error);
  }
};

// Call Gemini API
export const callGeminiAPI = async (prompt: string, apiKey: string, model?: string): Promise<string> => {
  const modelsToTry = model ? [model] : AI_MODELS.gemini.models;
  
  for (const modelName of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } else if (response.status !== 404 && response.status !== 429) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }
    } catch (error: any) {
      if (error.message && !error.message.includes('404') && !error.message.includes('429')) {
        throw error;
      }
      continue; // Try next model
    }
  }
  
  throw new Error('All Gemini models failed. Please check your API key and quota.');
};

// Call DeepSeek API
export const callDeepSeekAPI = async (prompt: string, apiKey: string, model?: string): Promise<string> => {
  const modelToUse = model || AI_MODELS.deepseek.models[0];
  
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: [
        { role: 'system', content: 'You are an experienced medical professional certified in emergency medicine and first aid.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `DeepSeek API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  
  throw new Error('Invalid response from DeepSeek API');
};

// Call OpenAI API
export const callOpenAIAPI = async (prompt: string, apiKey: string, model?: string): Promise<string> => {
  const modelToUse = model || AI_MODELS.openai.models[0];
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: [
        { role: 'system', content: 'You are an experienced medical professional certified in emergency medicine and first aid.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  
  throw new Error('Invalid response from OpenAI API');
};

// Unified AI API call function
export const callAIAPI = async (prompt: string, model?: AIModel): Promise<string> => {
  const selectedModel = model || getSelectedModel();
  const apiKey = getApiKey(selectedModel);
  
  if (!apiKey) {
    throw new Error(`Please configure your ${AI_MODELS[selectedModel].name} API key in Account Settings.`);
  }

  console.log(`🤖 Calling ${AI_MODELS[selectedModel].name} API...`);

  switch (selectedModel) {
    case 'gemini':
      return await callGeminiAPI(prompt, apiKey);
    case 'deepseek':
      return await callDeepSeekAPI(prompt, apiKey);
    case 'openai':
      return await callOpenAIAPI(prompt, apiKey);
    default:
      throw new Error(`Unsupported AI model: ${selectedModel}`);
  }
};

