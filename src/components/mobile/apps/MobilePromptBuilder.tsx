'use client';

import { useState } from 'react';
import { Plus, Copy, Save, Play, Zap } from 'lucide-react';

interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  prompt: string;
  variables: string[];
}

const templates: PromptTemplate[] = [
  {
    id: '1',
    name: 'Code Review',
    category: 'Development',
    prompt: 'Please review this {{language}} code for:\n- Code quality and best practices\n- Performance issues\n- Security vulnerabilities\n\nCode:\n{{code}}',
    variables: ['language', 'code']
  },
  {
    id: '2',
    name: 'Email Draft',
    category: 'Communication',
    prompt: 'Write a professional email about {{topic}} to {{recipient}}. The tone should be {{tone}} and include:\n- {{key_points}}',
    variables: ['topic', 'recipient', 'tone', 'key_points']
  },
  {
    id: '3',
    name: 'Meeting Summary',
    category: 'Productivity',
    prompt: 'Summarize this meeting transcript:\n\n{{transcript}}\n\nInclude:\n- Key decisions made\n- Action items\n- Next steps',
    variables: ['transcript']
  }
];

export function MobilePromptBuilder() {
  const [activeTab, setActiveTab] = useState<'templates' | 'builder'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});

  const fillTemplate = (template: PromptTemplate) => {
    let filledPrompt = template.prompt;
    Object.entries(variables).forEach(([key, value]) => {
      filledPrompt = filledPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return filledPrompt;
  };

  const extractVariables = (prompt: string) => {
    const matches = prompt.match(/{{([^}]+)}}/g);
    return matches ? matches.map(match => match.slice(2, -2)) : [];
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'templates', label: 'Templates', icon: Save },
            { id: 'builder', label: 'Builder', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium ${
                activeTab === id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="flex-1 overflow-y-auto">
          {selectedTemplate ? (
            <div className="p-4">
              <div className="mb-4">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-purple-600 text-sm font-medium"
                >
                  ← Back to Templates
                </button>
                <h2 className="text-lg font-semibold mt-2">{selectedTemplate.name}</h2>
                <span className="text-sm text-gray-500">{selectedTemplate.category}</span>
              </div>

              {/* Variables */}
              <div className="space-y-3 mb-4">
                {selectedTemplate.variables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variable.replace('_', ' ').toUpperCase()}
                    </label>
                    <textarea
                      value={variables[variable] || ''}
                      onChange={(e) => setVariables(prev => ({
                        ...prev,
                        [variable]: e.target.value
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                      rows={2}
                      placeholder={`Enter ${variable}...`}
                    />
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                <div className="p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">
                  {fillTemplate(selectedTemplate)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(fillTemplate(selectedTemplate))}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
                  <Play size={16} />
                  Run
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className="p-4 bg-white border border-gray-200 rounded-lg text-left shadow-sm active:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.prompt.substring(0, 100)}...
                    </p>
                    <div className="flex gap-1 mt-2">
                      {template.variables.slice(0, 3).map((variable) => (
                        <span key={variable} className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          {variable}
                        </span>
                      ))}
                      {template.variables.length > 3 && (
                        <span className="text-xs text-gray-500">+{template.variables.length - 3}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="flex-1 p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Build Your Prompt
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none"
              placeholder="Write your prompt here... Use {{variable}} for dynamic content."
            />
          </div>

          {/* Detected Variables */}
          {extractVariables(customPrompt).length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Variables Detected</h3>
              <div className="space-y-2">
                {extractVariables(customPrompt).map((variable) => (
                  <div key={variable}>
                    <label className="block text-xs text-gray-600 mb-1">{variable}</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder={`Enter ${variable}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
              <Save size={16} />
              Save as Template
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
              <Play size={16} />
              Test Prompt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}