'use client';

import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
  dueDate?: string;
  details?: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Vintage Web Portal',
    description: 'Creating a 90s-style team dashboard',
    progress: 75,
    status: 'active'
  },
  {
    id: '2',
    name: 'AI Assistant Integration',
    description: 'Adding Founty to team workflows',
    progress: 40,
    status: 'active'
  },
  {
    id: '3',
    name: 'Music Sync Platform',
    description: 'Spotify playlist integration system',
    progress: 15,
    status: 'active'
  }
];

export function MobileProjects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [loading, setLoading] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const notionProjects = await response.json();
        setProjects(notionProjects);
      } else {
        console.warn('Failed to fetch from Notion, using mock data');
      }
    } catch (error) {
      console.warn('Error fetching projects, using mock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestion.trim()) {
      alert(`Project suggestion submitted: ${suggestion}`);
      setSuggestion('');
      setShowSuggestionForm(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Current Projects</h2>
        <button
          className="bg-gray-200 hover:bg-gray-300 border border-gray-400 px-3 py-2 rounded flex items-center gap-2"
          onClick={() => setShowSuggestionForm(!showSuggestionForm)}
        >
          <Plus size={16} />
          Suggest
        </button>
      </div>

      {showSuggestionForm && (
        <div className="mb-4 p-4 border border-gray-400 bg-gray-100 rounded">
          <form onSubmit={handleSubmitSuggestion}>
            <label className="block text-sm mb-2 font-medium">Project Suggestion:</label>
            <input
              type="text"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="w-full p-2 border border-gray-400 text-sm rounded"
              placeholder="Enter your project idea..."
            />
            <div className="flex gap-2 mt-3">
              <button type="submit" className="bg-gray-200 hover:bg-gray-300 border border-gray-400 px-3 py-2 rounded text-sm">Submit</button>
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 border border-gray-400 px-3 py-2 rounded text-sm"
                onClick={() => setShowSuggestionForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {loading && <div className="text-sm text-gray-500 p-3">Loading projects...</div>}
        {projects.map((project) => {
          const isExpanded = expandedProjects.has(project.id);
          return (
            <div key={project.id} className="mb-4 p-4 border border-gray-400 bg-white rounded shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-2 flex-1">
                  {project.details && (
                    <button
                      onClick={() => toggleExpanded(project.id)}
                      className="text-gray-600 hover:text-gray-800 mt-1"
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{project.name}</h3>
                    {project.dueDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  project.status === 'active' ? 'bg-green-200' :
                  project.status === 'completed' ? 'bg-blue-200' :
                  'bg-yellow-200'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{project.description}</p>

              {isExpanded && project.details && (
                <div className="mb-3 p-3 bg-gray-50 border border-gray-200 text-sm rounded">
                  <div className="font-semibold mb-2">Details:</div>
                  <div className="text-gray-700">{project.details}</div>
                </div>
              )}

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-blue-500 h-2 rounded transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}