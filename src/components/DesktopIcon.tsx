'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';

interface DesktopIconProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  x?: number;
  y?: number;
}

export function DesktopIcon({ icon, label, onClick, x = 100, y = 100 }: DesktopIconProps) {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [clickTime, setClickTime] = useState(0);
  const iconRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 80, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - clickTime;

    // Double-click detection (within 300ms)
    if (timeDiff < 300) {
      onClick();
      return;
    }

    setClickTime(currentTime);

    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isDragging ? 'dragging' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'pointer'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="desktop-icon-image">
        {icon}
      </div>
      <div className="desktop-icon-label">
        {label}
      </div>
    </div>
  );
}