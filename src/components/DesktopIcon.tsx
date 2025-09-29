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
  const [lastClickTime, setLastClickTime] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  const dragThreshold = 5; // pixels to move before considering it a drag
  const holdTime = 150; // ms to hold before drag starts

  // Handle mouse movement during drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 80, newX)),
          y: Math.max(0, Math.min(window.innerHeight - 100, newY)),
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.userSelect = '';
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    // Check for double-click first (within 400ms)
    if (timeDiff < 400) {
      onClick();
      setLastClickTime(0); // Reset to prevent triple-click
      return;
    }

    // Set up for potential drag
    setLastClickTime(currentTime);
    setDragStartPosition({ x: e.clientX, y: e.clientY });

    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    // Set up drag detection after hold time
    const startDragTimer = setTimeout(() => {
      setIsDragging(true);
    }, holdTime);

    // Mouse move handler for early drag detection
    const handleEarlyMouseMove = (e: MouseEvent) => {
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - dragStartPosition.x, 2) +
        Math.pow(e.clientY - dragStartPosition.y, 2)
      );

      // If user moves more than threshold, start drag immediately
      if (moveDistance > dragThreshold) {
        clearTimeout(startDragTimer);
        setIsDragging(true);
        document.removeEventListener('mousemove', handleEarlyMouseMove);
      }
    };

    // Mouse up handler to cancel drag if released too early
    const handleEarlyMouseUp = () => {
      clearTimeout(startDragTimer);
      document.removeEventListener('mousemove', handleEarlyMouseMove);
      document.removeEventListener('mouseup', handleEarlyMouseUp);
    };

    document.addEventListener('mousemove', handleEarlyMouseMove);
    document.addEventListener('mouseup', handleEarlyMouseUp);
  };

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isDragging ? 'dragging' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'pointer',
        position: 'absolute',
        userSelect: 'none'
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