'use client';

import { useState } from 'react';
import { Copy, Download, Sparkles, FileText } from 'lucide-react';

export function PromptBuilderWindow() {
  const [formData, setFormData] = useState({
    productName: '',
    productVision: '',
    targetAudience: '',
    problemStatement: '',
    additionalRequirements: ''
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePrompt = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate prompt';
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data || !data.prompt) {
        throw new Error('Invalid response from server - no prompt generated');
      }

      setGeneratedPrompt(data.prompt);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while generating the prompt';
      setError(errorMessage);
      console.error('Error generating prompt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  const downloadAsFile = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.productName || 'prompt'}_replit_prompt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      productVision: '',
      targetAudience: '',
      problemStatement: '',
      additionalRequirements: ''
    });
    setGeneratedPrompt('');
    setError('');
  };

  return (
    <div className="h-full flex bg-gray-200 font-sans">
      {/* Main container with classic Mac OS styling */}
      <div className="flex-1 flex">
        {/* Left Panel - Form */}
        <div className="w-1/2 bg-gray-200 border-r-4 border-gray-400 p-6 overflow-y-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Product Requirements</h3>
            <p className="text-xs text-gray-600">Fill in your product details below</p>
          </div>

          <div className="space-y-8">
            {/* Product Name Field */}
            <div className="flex items-start gap-4">
              <label className="font-bold text-sm mt-2 w-32 text-right">
                Product Name:
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-2 py-1.5 bg-white border-2 border-black text-sm font-mono"
                  style={{
                    boxShadow: 'inset -1px -1px 0 white, inset 1px 1px 0 #808080',
                    outline: 'none'
                  }}
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  placeholder="e.g., Interview Prep Assistant"
                />
              </div>
            </div>

            {/* Product Vision Field */}
            <div className="flex items-start gap-4">
              <label className="font-bold text-sm mt-2 w-32 text-right">
                Product Vision:
              </label>
              <div className="flex-1">
                <textarea
                  className="w-full px-2 py-1.5 bg-white border-2 border-black text-sm font-mono h-20 resize-none"
                  style={{
                    boxShadow: 'inset -1px -1px 0 white, inset 1px 1px 0 #808080',
                    outline: 'none'
                  }}
                  value={formData.productVision}
                  onChange={(e) => setFormData({...formData, productVision: e.target.value})}
                  placeholder="What does your product help users accomplish?"
                />
              </div>
            </div>

            {/* Target Audience Field */}
            <div className="flex items-start gap-4">
              <label className="font-bold text-sm mt-2 w-32 text-right">
                Target Audience:
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-2 py-1.5 bg-white border-2 border-black text-sm font-mono"
                  style={{
                    boxShadow: 'inset -1px -1px 0 white, inset 1px 1px 0 #808080',
                    outline: 'none'
                  }}
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="e.g., students, businesses"
                />
              </div>
            </div>

            {/* Problem Statement Field */}
            <div className="flex items-start gap-4">
              <label className="font-bold text-sm mt-2 w-32 text-right">
                Problem Statement:
              </label>
              <div className="flex-1">
                <textarea
                  className="w-full px-2 py-1.5 bg-white border-2 border-black text-sm font-mono h-20 resize-none"
                  style={{
                    boxShadow: 'inset -1px -1px 0 white, inset 1px 1px 0 #808080',
                    outline: 'none'
                  }}
                  value={formData.problemStatement}
                  onChange={(e) => setFormData({...formData, problemStatement: e.target.value})}
                  placeholder="What problem does this solve?"
                />
              </div>
            </div>

            {/* Additional Requirements Field */}
            <div className="flex items-start gap-4">
              <label className="font-bold text-sm mt-2 w-32 text-right">
                Requirements:
              </label>
              <div className="flex-1">
                <textarea
                  className="w-full px-2 py-1.5 bg-white border-2 border-black text-sm font-mono h-16 resize-none"
                  style={{
                    boxShadow: 'inset -1px -1px 0 white, inset 1px 1px 0 #808080',
                    outline: 'none'
                  }}
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({...formData, additionalRequirements: e.target.value})}
                  placeholder="Specific features or integrations"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-6">
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 font-bold text-sm border-2 border-black hover:bg-gray-300"
                style={{
                  boxShadow: '2px 2px 0 black, inset 1px 1px 0 white, inset -1px -1px 0 #808080',
                }}
              >
                Clear
              </button>
              <button
                onClick={generatePrompt}
                disabled={isLoading}
                className={`px-6 py-2 font-bold text-sm border-2 border-black ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-white hover:bg-gray-100'
                }`}
                style={{
                  boxShadow: isLoading
                    ? 'inset -1px -1px 0 white, inset 1px 1px 0 #808080'
                    : '2px 2px 0 black, inset 1px 1px 0 white, inset -1px -1px 0 #808080',
                }}
              >
                {isLoading ? 'Generating...' : 'Generate Prompt'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-white border-2 border-black text-red-600 text-xs"
                style={{
                  boxShadow: 'inset -1px -1px 0 white, inset 1px 1px 0 #808080'
                }}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Generated Prompt */}
        <div className="w-1/2 bg-gray-200 p-6 flex flex-col overflow-hidden">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-2">Generated Prompt</h3>
            <p className="text-xs text-gray-600">
              {generatedPrompt ? 'Your Replit prompt is ready!' : 'Prompt will appear here'}
            </p>
          </div>

          {/* Output Area */}
          <div className="flex-1 bg-white border-2 border-black p-4 overflow-auto mb-4 font-mono text-xs"
            style={{
              boxShadow: 'inset -1px -1px 0 white, inset 1px 1px 0 #808080'
            }}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mb-4"></div>
                <div className="text-center text-gray-600">
                  <div className="font-bold mb-2">Processing with Claude...</div>
                  <div className="text-xs">Please wait a moment</div>
                </div>
              </div>
            ) : generatedPrompt ? (
              <pre className="whitespace-pre-wrap text-black leading-relaxed">
                {generatedPrompt}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-center">
                <div>
                  <div className="mb-3">
                    <FileText size={32} className="mx-auto opacity-50" />
                  </div>
                  <div>Ready to generate your prompt</div>
                  <div className="text-xs mt-2">Fill in the form and click Generate</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {generatedPrompt && (
            <div className="flex justify-center gap-3">
              <button
                onClick={copyToClipboard}
                className="px-6 py-2 bg-white font-bold text-sm border-2 border-black hover:bg-gray-100 flex items-center gap-2"
                style={{
                  boxShadow: '2px 2px 0 black, inset 1px 1px 0 white, inset -1px -1px 0 #808080',
                }}
              >
                <Copy size={14} />
                Copy
              </button>
              <button
                onClick={downloadAsFile}
                className="px-6 py-2 bg-white font-bold text-sm border-2 border-black hover:bg-gray-100 flex items-center gap-2"
                style={{
                  boxShadow: '2px 2px 0 black, inset 1px 1px 0 white, inset -1px -1px 0 #808080',
                }}
              >
                <Download size={14} />
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}