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

export function MobileTeam() {
  return (
    <div className="h-full bg-white p-4">
      <h2 className="font-bold text-lg mb-4">Fountain Team</h2>

      <div className="space-y-4 mb-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-400 bg-white rounded shadow-sm">
            <div className="relative">
              <div className="w-12 h-12 flex items-center justify-center">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : member.isAI ? (
                  <Bot size={24} className="text-blue-600" />
                ) : (
                  <User size={24} className="text-gray-600" />
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                member.status === 'online' ? 'bg-green-500' :
                member.status === 'away' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
            </div>

            <div className="flex-1">
              <div className="font-bold text-sm">{member.name}</div>
              <div className="text-sm text-gray-600">{member.role}</div>
              <div className="text-sm text-blue-600 hover:underline cursor-pointer">{member.email}</div>
              <div className="text-sm text-gray-500 capitalize">{member.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border border-gray-400 bg-gray-100 rounded">
        <h3 className="font-bold text-sm mb-3">Team Stats</h3>
        <div className="text-sm space-y-2">
          <div>Total Members: {teamMembers.length}</div>
          <div>Online: {teamMembers.filter(m => m.status === 'online').length}</div>
          <div>Departments: {new Set(teamMembers.map(m => m.role.split(' ')[0])).size}</div>
        </div>
      </div>
    </div>
  );
}