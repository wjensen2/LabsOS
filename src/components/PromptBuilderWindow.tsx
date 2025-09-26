'use client';

import { useState } from 'react';
import { Copy, FileText, Download, Sparkles } from 'lucide-react';

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
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate prompt');
      }

      const data = await response.json();
      setGeneratedPrompt(data.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the prompt');
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

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="flex-1 flex gap-4 p-4">
        {/* Left Panel - Form */}
        <div className="w-1/2 bg-white border-2 border-gray-400 p-4" style={{ borderStyle: 'inset' }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText size={20} />
            Product Requirements
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Product Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-gray-400 text-sm"
                style={{ borderStyle: 'inset' }}
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                placeholder="e.g., Interview Prep Assistant"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Product Vision</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-gray-400 text-sm h-20"
                style={{ borderStyle: 'inset' }}
                value={formData.productVision}
                onChange={(e) => setFormData({...formData, productVision: e.target.value})}
                placeholder="What does your product help users accomplish?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Target Audience</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-gray-400 text-sm"
                style={{ borderStyle: 'inset' }}
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                placeholder="e.g., frontline workers, students, small business owners"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Problem Statement</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-gray-400 text-sm h-20"
                style={{ borderStyle: 'inset' }}
                value={formData.problemStatement}
                onChange={(e) => setFormData({...formData, problemStatement: e.target.value})}
                placeholder="What problem does this solve or what value does it create?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Additional Requirements</label>
              <textarea
                className="w-full px-3 py-2 border-2 border-gray-400 text-sm h-16"
                style={{ borderStyle: 'inset' }}
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({...formData, additionalRequirements: e.target.value})}
                placeholder="Any specific features, integrations, or technical requirements?"
              />
            </div>

            <button
              onClick={generatePrompt}
              disabled={isLoading}
              className={`w-full py-3 text-white font-bold border-2 border-gray-800 flex items-center justify-center gap-2 ${
                isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              style={{ borderStyle: 'outset' }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating with Claude...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate with Claude Sonnet 4
                </>
              )}
            </button>

            {error && (
              <div className="mt-3 p-3 bg-red-100 border-2 border-red-400 text-red-700 text-sm" style={{ borderStyle: 'inset' }}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Generated Prompt */}
        <div className="w-1/2 bg-white border-2 border-gray-400 p-4 flex flex-col" style={{ borderStyle: 'inset' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FileText size={20} />
              Generated Prompt
            </h3>
            {generatedPrompt && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-green-500 text-white text-xs font-bold border-2 border-gray-800 hover:bg-green-600 flex items-center gap-1"
                  style={{ borderStyle: 'outset' }}
                >
                  <Copy size={12} />
                  Copy
                </button>
                <button
                  onClick={downloadAsFile}
                  className="px-3 py-1 bg-purple-500 text-white text-xs font-bold border-2 border-gray-800 hover:bg-purple-600 flex items-center gap-1"
                  style={{ borderStyle: 'outset' }}
                >
                  <Download size={12} />
                  Download
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-gray-50 border-2 border-gray-400 p-3 overflow-auto" style={{ borderStyle: 'inset' }}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                <div className="text-gray-600 text-sm">
                  <div className="font-bold mb-2">🤖 Claude is crafting your prompt...</div>
                  <div className="text-xs">This may take a few seconds</div>
                </div>
              </div>
            ) : generatedPrompt ? (
              <pre className="text-xs whitespace-pre-wrap font-mono text-gray-800 leading-relaxed">
                {generatedPrompt}
              </pre>
            ) : (
              <div className="text-center text-gray-500 text-sm mt-8">
                <div className="mb-4">✨ Ready to create your perfect Replit prompt?</div>
                <div className="text-xs">
                  Fill out the form and click "Generate with Claude Sonnet 4" to create a
                  comprehensive, tailored prompt for your project.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}