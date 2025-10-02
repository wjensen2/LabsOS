'use client';

import { Apple } from 'lucide-react';
import { useState } from 'react';

export function MenuBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  });

  const menuItems = [
    { id: 'file', label: 'File' },
    { id: 'edit', label: 'Edit' },
    { id: 'view', label: 'View' },
    { id: 'special', label: 'Special' },
    { id: 'help', label: 'Help' },
  ];

  return (
    <div className="menu-bar">
      {/* Apple Menu */}
      <div className="menu-bar-item apple-menu">
        <Apple size={16} fill="currentColor" />
      </div>

      {/* Menu Items */}
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`menu-bar-item ${activeMenu === item.id ? 'active' : ''}`}
          onMouseEnter={() => setActiveMenu(item.id)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          {item.label}
        </div>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side - Finder Icon and Time */}
      <div className="menu-bar-right">
        <div className="menu-bar-item">
          <span className="font-bold">Finder</span>
        </div>
        <div className="menu-bar-item">
          {currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
