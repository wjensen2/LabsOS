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
      e.preventDefault();
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 80, newX)),
          y: Math.max(0, Math.min(window.innerHeight - 100, newY)),
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentTime = Date.now();
    const timeDiff = currentTime - clickTime;

    // Double-click detection (within 300ms)
    if (timeDiff < 300) {
      onClick();
      return;
    }

    setClickTime(currentTime);

    // Start drag after a short delay to differentiate from double-click
    setTimeout(() => {
      if (Date.now() - currentTime >= 150) { // Only start drag if no second click happened
        if (iconRef.current) {
          const rect = iconRef.current.getBoundingClientRect();
          setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          setIsDragging(true);
        }
      }
    }, 150);
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