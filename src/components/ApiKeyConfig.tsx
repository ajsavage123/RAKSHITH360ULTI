import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';

interface ApiKeyConfigProps {
  onApiKeySet: (key: string) => void;
  onClose?: () => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onApiKeySet, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('API key cannot be empty');
      return;
    }
    setError('');
    onApiKeySet(apiKey.trim());
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-xs flex flex-col gap-3 relative">
        {/* Close button in top right */}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 p-1 h-auto w-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
        <h2 className="text-lg font-semibold mb-2 text-center pr-8">Enter Gemini API Key</h2>
        <Input
          type="text"
          placeholder="Paste your Gemini API key here"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="mb-2"
        />
        {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleSave}>Save</Button>
          {onClose && <Button className="flex-1" variant="outline" onClick={onClose}>Cancel</Button>}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          Or configure in <strong>Account Settings</strong> for all AI models
        </p>
      </div>
    </div>
  );
};

export default ApiKeyConfig; 