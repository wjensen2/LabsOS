'use client';

import { Bot, User } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  avatar?: string;
  isAI?: boolean;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: '@will',
    role: 'Lead Developer',
    status: 'online',
  },
  {
    id: '2',
    name: 'Founty',
    role: 'AI Assistant',
    status: 'online',
    isAI: true,
  }
];

export function TeamWindow() {
  return (
    <div className="h-full">
      <h2 className="font-bold text-sm mb-4">Fountain Labs Team</h2>
      
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-3 p-3 border border-gray-400 bg-white">
            <div className="relative">
              <div className="w-8 h-8 bg-gray-300 border border-gray-400 flex items-center justify-center">
                {member.isAI ? (
                  <Bot size={16} className="text-blue-600" />
                ) : (
                  <User size={16} className="text-gray-600" />
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                member.status === 'online' ? 'bg-green-500' :
                member.status === 'away' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
            </div>
            
            <div className="flex-1">
              <div className="font-bold text-xs">{member.name}</div>
              <div className="text-xs text-gray-600">{member.role}</div>
              <div className="text-xs text-gray-500 capitalize">{member.status}</div>
            </div>
            
            {member.isAI && (
              <div className="text-xs bg-blue-100 px-2 py-1 rounded">
                AI
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 border border-gray-400 bg-gray-100">
        <h3 className="font-bold text-xs mb-2">Team Stats</h3>
        <div className="text-xs space-y-1">
          <div>Total Members: {teamMembers.length}</div>
          <div>Online: {teamMembers.filter(m => m.status === 'online').length}</div>
          <div>AI Assistants: {teamMembers.filter(m => m.isAI).length}</div>
        </div>
      </div>
    </div>
  );
}