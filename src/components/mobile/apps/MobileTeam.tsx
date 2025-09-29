'use client';

import Image from 'next/image';

const team = [
  { name: 'Jeremy Schifeling', role: 'CEO', avatar: '/jschifeling.png', status: 'online' },
  { name: 'Mark O\'Brien', role: 'CMO', avatar: '/mobrien.png', status: 'online' },
  { name: 'Keith Ryu', role: 'CPO', avatar: '/kryu.png', status: 'offline' },
  { name: 'Nagaraju Kancheti', role: 'VP of Engineering', avatar: '/nkancheti.png', status: 'online' },
  { name: 'Dr. Yigang Zhou', role: 'Chief Architect', avatar: '/yzhou.png', status: 'online' },
];

export function MobileTeam() {
  return (
    <div className="h-full bg-gray-50">
      <div className="p-4 space-y-3">
        {team.map((member) => (
          <div key={member.name} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}