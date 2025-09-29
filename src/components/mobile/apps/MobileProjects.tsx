'use client';

import { useState } from 'react';
import { Folder, Star, Clock, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'upcoming';
  lastUpdated: string;
  starred: boolean;
  progress: number;
}

const projects: Project[] = [
  { id: '1', name: 'Fountain AI Platform', status: 'active', lastUpdated: '2 hours ago', starred: true, progress: 75 },
  { id: '2', name: 'Agent Systems', status: 'active', lastUpdated: '1 day ago', starred: true, progress: 60 },
  { id: '3', name: 'Nora AI Assistant', status: 'completed', lastUpdated: '1 week ago', starred: false, progress: 100 },
  { id: '4', name: 'Workforce Analytics', status: 'active', lastUpdated: '3 days ago', starred: false, progress: 45 },
  { id: '5', name: 'Mobile Experience', status: 'upcoming', lastUpdated: 'Not started', starred: false, progress: 0 },
];

export function MobileProjects() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'starred'>('all');

  const filteredProjects = projects.filter(project => {
    if (selectedTab === 'starred') return project.starred;
    if (selectedTab === 'active') return project.status === 'active';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'upcoming': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full bg-white">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-around p-2">
          {(['all', 'active', 'starred'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                selectedTab === tab
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="p-4 space-y-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm active:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Folder size={16} className="text-purple-600" />
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-white ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {project.lastUpdated}
                  </span>
                </div>
              </div>
              <button className="p-2">
                <Star
                  size={20}
                  className={project.starred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <button className="mt-3 w-full flex items-center justify-between text-sm text-purple-600 font-medium">
              <span>View Details</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}