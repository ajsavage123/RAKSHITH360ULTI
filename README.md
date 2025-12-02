# Rakshith360 - AI-Powered Medical Assessment

A React-based medical assessment application powered by Google's Gemini AI.

## Features

- AI-powered medical symptom assessment
- Interactive question flow
- Medical specialty recommendations
- Hospital recommendations
- Real-time chat interface
- User authentication
- Session management

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd RAKSHITH360
```

2. Install dependencies:
```bash
npm install
```

### API Key Configuration

This application uses Google's Gemini AI API for medical assessments. You need to configure your API key:

#### Option 1: Environment Variable (Recommended)
1. Create a `.env` file in the root directory
2. Add your Gemini API key:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

#### Option 2: In-App Configuration
1. Run the application
2. When prompted, enter your API key in the configuration modal
3. The key will be saved for your current session

#### Getting Your API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or another port if 3000 is busy).

## Usage

1. **Authentication**: Sign up or log in to your account
2. **Start Assessment**: Begin a new medical assessment session
3. **Interactive Questions**: Answer AI-generated questions about your symptoms

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **AI**: Google Gemini API
- **Storage**: LocalStorage (client-side)
- **Authentication**: Custom implementation

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   └── ...             # Custom components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Notes

- API keys are stored locally and should not be committed to version control
- The `.env` file is already included in `.gitignore`
- For production, use proper environment variable management

## Support

If you encounter issues with the API:
1. Check your API key configuration
2. Verify your internet connection
3. Ensure your Google AI Studio account has proper permissions
4. Check the browser console for detailed error messages
