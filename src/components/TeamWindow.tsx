'use client';

import { Bot, User } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'online' | 'away' | 'offline';
  avatar?: string;
  isAI?: boolean;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sean',
    role: 'CEO',
    email: 'sean@fountain.com',
    status: 'online',
    avatar: '/bear.png',
  },
  {
    id: '2',
    name: 'Will',
    role: 'Product',
    email: 'will@fountain.com',
    status: 'online',
    avatar: '/duck.png',
  },
  {
    id: '3',
    name: 'Pete',
    role: 'Customer Success',
    email: 'pete@fountain.com',
    status: 'online',
    avatar: '/mouse.png',
  },
  {
    id: '4',
    name: 'Hilary',
    role: 'Operations',
    email: 'hilary.church@fountain.com',
    status: 'online',
    avatar: '/unicorn.png',
  },
  {
    id: '5',
    name: 'Bastien',
    role: 'Marketing',
    email: 'bastien.botella@fountain.com',
    status: 'online',
    avatar: '/tiger.png',
  },
];

export function TeamWindow() {
  return (
    <div className="h-full">
      <h2 className="font-bold text-sm mb-4">Fountain Team</h2>
      
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-3 p-3 border border-gray-400 bg-white">
            <div className="relative">
              <div className="w-8 h-8 flex items-center justify-center">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : member.isAI ? (
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
              <div className="text-xs text-blue-600 hover:underline cursor-pointer">{member.email}</div>
              <div className="text-xs text-gray-500 capitalize">{member.status}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 border border-gray-400 bg-gray-100">
        <h3 className="font-bold text-xs mb-2">Team Stats</h3>
        <div className="text-xs space-y-1">
          <div>Total Members: {teamMembers.length}</div>
          <div>Online: {teamMembers.filter(m => m.status === 'online').length}</div>
          <div>Departments: {new Set(teamMembers.map(m => m.role.split(' ')[0])).size}</div>
        </div>
      </div>
    </div>
  );
}