'use client';

import { useState } from 'react';
import { Copy, Download, FileText } from 'lucide-react';

export function MobilePromptBuilder() {
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
    <div className="h-full flex flex-col bg-gray-200 font-sans overflow-hidden" style={{ backgroundColor: '#c0c0c0' }}>
      {/* Main container with classic Mac OS styling */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center p-4 border-b-2 border-gray-500" style={{ borderBottomColor: '#808080' }}>
          <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Chicago, sans-serif' }}>
            Product Requirements
          </h3>
          <p className="text-xs text-gray-700">Fill in your product details below</p>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-4 overflow-y-auto" style={{ backgroundColor: '#c0c0c0' }}>
          <div className="space-y-4">
            {/* Product Name Field */}
            <div>
              <label className="block font-bold text-sm mb-2">
                Product Name:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border-2 border-black text-sm font-mono"
                style={{
                  boxShadow: 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080',
                  outline: 'none',
                  fontFamily: 'Monaco, monospace'
                }}
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                placeholder="e.g., Interview Prep Assistant"
              />
            </div>

            {/* Product Vision Field */}
            <div>
              <label className="block font-bold text-sm mb-2">
                Product Vision:
              </label>
              <textarea
                className="w-full px-3 py-2 bg-white border-2 border-black text-sm font-mono h-20 resize-none"
                style={{
                  boxShadow: 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080',
                  outline: 'none',
                  fontFamily: 'Monaco, monospace'
                }}
                value={formData.productVision}
                onChange={(e) => setFormData({...formData, productVision: e.target.value})}
                placeholder="What does your product help users accomplish?"
              />
            </div>

            {/* Target Audience Field */}
            <div>
              <label className="block font-bold text-sm mb-2">
                Target Audience:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border-2 border-black text-sm font-mono"
                style={{
                  boxShadow: 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080',
                  outline: 'none',
                  fontFamily: 'Monaco, monospace'
                }}
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                placeholder="e.g., students, businesses"
              />
            </div>

            {/* Problem Statement Field */}
            <div>
              <label className="block font-bold text-sm mb-2">
                Problem Statement:
              </label>
              <textarea
                className="w-full px-3 py-2 bg-white border-2 border-black text-sm font-mono h-20 resize-none"
                style={{
                  boxShadow: 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080',
                  outline: 'none',
                  fontFamily: 'Monaco, monospace'
                }}
                value={formData.problemStatement}
                onChange={(e) => setFormData({...formData, problemStatement: e.target.value})}
                placeholder="What problem does this solve?"
              />
            </div>

            {/* Additional Requirements Field */}
            <div>
              <label className="block font-bold text-sm mb-2">
                Requirements:
              </label>
              <textarea
                className="w-full px-3 py-2 bg-white border-2 border-black text-sm font-mono h-16 resize-none"
                style={{
                  boxShadow: 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080',
                  outline: 'none',
                  fontFamily: 'Monaco, monospace'
                }}
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({...formData, additionalRequirements: e.target.value})}
                placeholder="Specific features or integrations"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleReset}
                className="flex-1 py-2 font-bold text-sm border-2 border-black"
                style={{
                  backgroundColor: '#c0c0c0',
                  boxShadow: '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080',
                  fontFamily: 'Chicago, sans-serif'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
                }}
              >
                Clear
              </button>
              <button
                onClick={generatePrompt}
                disabled={isLoading}
                className={`flex-1 py-2 font-bold text-sm border-2 border-black ${
                  isLoading ? 'opacity-50' : ''
                }`}
                style={{
                  backgroundColor: isLoading ? '#a0a0a0' : '#ffffff',
                  boxShadow: isLoading
                    ? 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080'
                    : '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080',
                  fontFamily: 'Chicago, sans-serif'
                }}
                onMouseDown={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.boxShadow = 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080';
                  }
                }}
                onMouseUp={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.boxShadow = '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.boxShadow = '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
                  }
                }}
              >
                {isLoading ? 'Generating...' : 'Generate Prompt'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-white border-2 border-black text-red-600 text-xs"
                style={{
                  boxShadow: 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080',
                  fontFamily: 'Monaco, monospace'
                }}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        {/* Generated Prompt Section */}
        <div className="border-t-2 border-gray-500 p-4" style={{ borderTopColor: '#808080', backgroundColor: '#c0c0c0' }}>
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Chicago, sans-serif' }}>
              Generated Prompt
            </h3>
            <p className="text-xs text-gray-700">
              {generatedPrompt ? 'Your Replit prompt is ready!' : 'Prompt will appear here'}
            </p>
          </div>

          {/* Output Area */}
          <div className="bg-white border-2 border-black p-4 mb-4 h-32 overflow-auto font-mono text-xs"
            style={{
              boxShadow: 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080',
              fontFamily: 'Monaco, monospace'
            }}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full mb-2"></div>
                <div className="text-center text-gray-700">
                  <div className="font-bold mb-1">Processing with Claude...</div>
                  <div className="text-xs">Please wait a moment</div>
                </div>
              </div>
            ) : generatedPrompt ? (
              <pre className="whitespace-pre-wrap text-black leading-relaxed text-xs">
                {generatedPrompt}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600 text-center">
                <div>
                  <div className="mb-2">
                    <FileText size={24} className="mx-auto opacity-40" />
                  </div>
                  <div className="font-bold text-xs">Ready to generate your prompt</div>
                  <div className="text-xs mt-1">Fill in the form and click Generate</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {generatedPrompt && (
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2 font-bold text-sm border-2 border-black flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080',
                  fontFamily: 'Chicago, sans-serif'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
                }}
              >
                <Copy size={12} />
                Copy
              </button>
              <button
                onClick={downloadAsFile}
                className="flex-1 py-2 font-bold text-sm border-2 border-black flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080',
                  fontFamily: 'Chicago, sans-serif'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '3px 3px 0 #000000, inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
                }}
              >
                <Download size={12} />
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}