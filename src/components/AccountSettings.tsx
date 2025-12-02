import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Key, Eye, EyeOff, CheckCircle2, XCircle, Trash2, ExternalLink, Brain } from 'lucide-react';
import { storageService } from '@/lib/storage';
import { AI_MODELS, AIModel, getSelectedModel, saveSelectedModel } from '@/lib/aiService';

interface AccountSettingsProps {
  onClose: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onClose }) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>(getSelectedModel());
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geoapifyKey, setGeoapifyKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showDeepseekKey, setShowDeepseekKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeoapifyKey, setShowGeoapifyKey] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [deepseekStatus, setDeepseekStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [openaiStatus, setOpenaiStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [geoapifyStatus, setGeoapifyStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load existing API keys
    const savedGemini = storageService.getApiKey('gemini') || '';
    const savedDeepseek = storageService.getApiKey('deepseek') || '';
    const savedOpenai = storageService.getApiKey('openai') || '';
    const savedGeoapify = storageService.getApiKey('geoapify') || '';
    
    // Also check environment variables as fallback
    const envGemini = import.meta.env.VITE_GEMINI_API_KEY || '';
    const envDeepseek = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    const envOpenai = import.meta.env.VITE_OPENAI_API_KEY || '';
    const envGeoapify = import.meta.env.VITE_GEOAPIFY_API_KEY || '';
    
    setGeminiKey(savedGemini || envGemini);
    setDeepseekKey(savedDeepseek || envDeepseek);
    setOpenaiKey(savedOpenai || envOpenai);
    setGeoapifyKey(savedGeoapify || envGeoapify);
  }, []);

  const handleSaveGeminiKey = async () => {
    if (!geminiKey.trim()) {
      setMessage({ type: 'error', text: 'Gemini API key cannot be empty' });
      return;
    }

    setGeminiStatus('saving');
    try {
      storageService.saveApiKey('gemini', geminiKey.trim());
      setGeminiStatus('success');
      setMessage({ type: 'success', text: 'Gemini API key saved successfully!' });
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('apiKeyUpdated'));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
        setGeminiStatus('idle');
      }, 3000);
    } catch (error) {
      setGeminiStatus('error');
      setMessage({ type: 'error', text: 'Failed to save Gemini API key' });
      setTimeout(() => {
        setMessage(null);
        setGeminiStatus('idle');
      }, 3000);
    }
  };

  const handleSaveGeoapifyKey = async () => {
    if (!geoapifyKey.trim()) {
      setMessage({ type: 'error', text: 'Geoapify API key cannot be empty' });
      return;
    }

    setGeoapifyStatus('saving');
    try {
      storageService.saveApiKey('geoapify', geoapifyKey.trim());
      setGeoapifyStatus('success');
      setMessage({ type: 'success', text: 'Geoapify API key saved successfully!' });
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('apiKeyUpdated'));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
        setGeoapifyStatus('idle');
      }, 3000);
    } catch (error) {
      setGeoapifyStatus('error');
      setMessage({ type: 'error', text: 'Failed to save Geoapify API key' });
      setTimeout(() => {
        setMessage(null);
        setGeoapifyStatus('idle');
      }, 3000);
    }
  };

  const handleDeleteGeminiKey = () => {
    if (confirm('Are you sure you want to delete the Gemini API key?')) {
      storageService.deleteApiKey('gemini');
      setGeminiKey('');
      setMessage({ type: 'success', text: 'Gemini API key deleted' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteGeoapifyKey = () => {
    if (confirm('Are you sure you want to delete the Geoapify API key?')) {
      storageService.deleteApiKey('geoapify');
      setGeoapifyKey('');
      setMessage({ type: 'success', text: 'Geoapify API key deleted' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveDeepseekKey = async () => {
    if (!deepseekKey.trim()) {
      setMessage({ type: 'error', text: 'DeepSeek API key cannot be empty' });
      return;
    }

    setDeepseekStatus('saving');
    try {
      storageService.saveApiKey('deepseek', deepseekKey.trim());
      setDeepseekStatus('success');
      setMessage({ type: 'success', text: 'DeepSeek API key saved successfully!' });
      window.dispatchEvent(new Event('apiKeyUpdated'));
      setTimeout(() => {
        setMessage(null);
        setDeepseekStatus('idle');
      }, 3000);
    } catch (error) {
      setDeepseekStatus('error');
      setMessage({ type: 'error', text: 'Failed to save DeepSeek API key' });
      setTimeout(() => {
        setMessage(null);
        setDeepseekStatus('idle');
      }, 3000);
    }
  };

  const handleSaveOpenaiKey = async () => {
    if (!openaiKey.trim()) {
      setMessage({ type: 'error', text: 'OpenAI API key cannot be empty' });
      return;
    }

    setOpenaiStatus('saving');
    try {
      storageService.saveApiKey('openai', openaiKey.trim());
      setOpenaiStatus('success');
      setMessage({ type: 'success', text: 'OpenAI API key saved successfully!' });
      window.dispatchEvent(new Event('apiKeyUpdated'));
      setTimeout(() => {
        setMessage(null);
        setOpenaiStatus('idle');
      }, 3000);
    } catch (error) {
      setOpenaiStatus('error');
      setMessage({ type: 'error', text: 'Failed to save OpenAI API key' });
      setTimeout(() => {
        setMessage(null);
        setOpenaiStatus('idle');
      }, 3000);
    }
  };

  const handleDeleteDeepseekKey = () => {
    if (confirm('Are you sure you want to delete the DeepSeek API key?')) {
      storageService.deleteApiKey('deepseek');
      setDeepseekKey('');
      setMessage({ type: 'success', text: 'DeepSeek API key deleted' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteOpenaiKey = () => {
    if (confirm('Are you sure you want to delete the OpenAI API key?')) {
      storageService.deleteApiKey('openai');
      setOpenaiKey('');
      setMessage({ type: 'success', text: 'OpenAI API key deleted' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);
    saveSelectedModel(model);
    window.dispatchEvent(new Event('apiKeyUpdated'));
    setMessage({ type: 'success', text: `Switched to ${AI_MODELS[model].name}` });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-lg shadow-xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] overflow-y-auto m-0 sm:m-4">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-white dark:bg-gray-900 pb-2 z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Account Settings</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
            >
              <XCircle className="w-5 h-5" />
            </Button>
          </div>

          {/* Message Alert */}
          {message && (
            <Alert className={`mb-4 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
              <AlertDescription className={message.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* AI Model Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Select AI Model
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Choose which AI model to use for medical assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select AI Model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AI_MODELS).map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Currently using: <strong>{AI_MODELS[selectedModel].name}</strong>
              </p>
            </CardContent>
          </Card>

          {/* API Keys Section */}
          <div className="space-y-6">
            {/* Gemini API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Google Gemini API Key
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Used for AI-powered medical assessments. Get your free API key from{' '}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 break-all"
                  >
                    Google AI Studio
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gemini-key" className="text-sm sm:text-base">API Key</Label>
                  <div className="space-y-2">
                    <div className="relative w-full">
                      <Input
                        id="gemini-key"
                        type={showGeminiKey ? 'text' : 'password'}
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="pr-10 w-full text-sm sm:text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 sm:px-3 hover:bg-transparent"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                      >
                        {showGeminiKey ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={handleSaveGeminiKey}
                        disabled={geminiStatus === 'saving'}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1 min-w-[100px] text-sm sm:text-base"
                      >
                        {geminiStatus === 'saving' ? 'Saving...' : geminiStatus === 'success' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : 'Save'}
                      </Button>
                      {geminiKey && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteGeminiKey}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 sm:px-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {geminiKey && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                      Key: {geminiKey.substring(0, 10)}...{geminiKey.substring(geminiKey.length - 4)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* DeepSeek API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  DeepSeek API Key
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Used for AI-powered medical assessments. Get your API key from{' '}
                  <a
                    href="https://platform.deepseek.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 break-all"
                  >
                    DeepSeek Platform
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deepseek-key" className="text-sm sm:text-base">API Key</Label>
                  <div className="space-y-2">
                    <div className="relative w-full">
                      <Input
                        id="deepseek-key"
                        type={showDeepseekKey ? 'text' : 'password'}
                        value={deepseekKey}
                        onChange={(e) => setDeepseekKey(e.target.value)}
                        placeholder="Enter your DeepSeek API key"
                        className="pr-10 w-full text-sm sm:text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 sm:px-3 hover:bg-transparent"
                        onClick={() => setShowDeepseekKey(!showDeepseekKey)}
                      >
                        {showDeepseekKey ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={handleSaveDeepseekKey}
                        disabled={deepseekStatus === 'saving'}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1 min-w-[100px] text-sm sm:text-base"
                      >
                        {deepseekStatus === 'saving' ? 'Saving...' : deepseekStatus === 'success' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : 'Save'}
                      </Button>
                      {deepseekKey && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteDeepseekKey}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 sm:px-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {deepseekKey && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                      Key: {deepseekKey.substring(0, 10)}...{deepseekKey.substring(deepseekKey.length - 4)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* OpenAI API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  OpenAI (ChatGPT) API Key
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Used for AI-powered medical assessments. Get your API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 break-all"
                  >
                    OpenAI Platform
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key" className="text-sm sm:text-base">API Key</Label>
                  <div className="space-y-2">
                    <div className="relative w-full">
                      <Input
                        id="openai-key"
                        type={showOpenaiKey ? 'text' : 'password'}
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        placeholder="Enter your OpenAI API key"
                        className="pr-10 w-full text-sm sm:text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 sm:px-3 hover:bg-transparent"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      >
                        {showOpenaiKey ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={handleSaveOpenaiKey}
                        disabled={openaiStatus === 'saving'}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1 min-w-[100px] text-sm sm:text-base"
                      >
                        {openaiStatus === 'saving' ? 'Saving...' : openaiStatus === 'success' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : 'Save'}
                      </Button>
                      {openaiKey && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteOpenaiKey}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 sm:px-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {openaiKey && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                      Key: {openaiKey.substring(0, 10)}...{openaiKey.substring(openaiKey.length - 4)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Geoapify API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Geoapify API Key
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Used for hospital location searches and geocoding. Get your free API key from{' '}
                  <a
                    href="https://www.geoapify.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 break-all"
                  >
                    Geoapify
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="geoapify-key" className="text-sm sm:text-base">API Key</Label>
                  <div className="space-y-2">
                    <div className="relative w-full">
                      <Input
                        id="geoapify-key"
                        type={showGeoapifyKey ? 'text' : 'password'}
                        value={geoapifyKey}
                        onChange={(e) => setGeoapifyKey(e.target.value)}
                        placeholder="Enter your Geoapify API key"
                        className="pr-10 w-full text-sm sm:text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 sm:px-3 hover:bg-transparent"
                        onClick={() => setShowGeoapifyKey(!showGeoapifyKey)}
                      >
                        {showGeoapifyKey ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={handleSaveGeoapifyKey}
                        disabled={geoapifyStatus === 'saving'}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1 min-w-[100px] text-sm sm:text-base"
                      >
                        {geoapifyStatus === 'saving' ? 'Saving...' : geoapifyStatus === 'success' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : 'Save'}
                      </Button>
                      {geoapifyKey && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteGeoapifyKey}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 sm:px-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {geoapifyKey && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                      Key: {geoapifyKey.substring(0, 10)}...{geoapifyKey.substring(geoapifyKey.length - 4)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 flex justify-end sticky bottom-0 bg-white dark:bg-gray-900 pt-2 pb-2">
            <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto px-6 text-sm sm:text-base">
              Close
            </Button>
          </div>

          {/* Info Note */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> API keys are stored locally in your browser. They will be used for all API calls.
              If you have API keys in your .env file, they will be used as fallback if no key is saved here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

