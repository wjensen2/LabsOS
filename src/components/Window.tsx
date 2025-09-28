'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import { ReactNode, useState, useRef, useEffect } from 'react';

interface WindowProps {
  title: string;
  isVisible: boolean;
  onClose?: () => void;
  children: ReactNode;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export function Window({
  title,
  isVisible,
  onClose,
  children,
  x = 100,
  y = 100,
  width = 400,
  height = 300
}: WindowProps) {
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Keep window within viewport bounds
        const boundedX = Math.max(0, Math.min(window.innerWidth - size.width, newX));
        const boundedY = Math.max(0, Math.min(window.innerHeight - size.height, newY));

        setPosition({
          x: boundedX,
          y: boundedY,
        });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        setSize({
          width: Math.max(250, resizeStart.width + deltaX),
          height: Math.max(200, resizeStart.height + deltaY),
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
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
  }, [isDragging, isResizing, dragOffset, resizeStart, size.width, size.height]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
    setIsResizing(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={windowRef}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="window-frame absolute z-10 select-none"
          style={{
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height,
            cursor: isDragging ? 'grabbing' : 'default',
          }}
        >
          {/* Title Bar */}
          <div
            className="window-title-bar flex items-center justify-between cursor-grab active:cursor-grabbing"
            onMouseDown={handleTitleBarMouseDown}
          >
            <span className="text-white font-bold select-none">{title}</span>
            <div className="flex gap-1">
              <button className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center text-xs hover:bg-gray-200">
                <Minus size={8} />
              </button>
              <button className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center text-xs hover:bg-gray-200">
                <Square size={6} />
              </button>
              <button
                onClick={onClose}
                className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center text-xs hover:bg-gray-200"
              >
                <X size={8} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-8 py-6 h-full overflow-auto" style={{ height: `calc(100% - 24px)` }}>
            {children}
          </div>

          {/* Resize Handle */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-400 border-l border-t border-gray-600"
            onMouseDown={handleResizeMouseDown}
            style={{
              background: 'linear-gradient(-45deg, transparent 30%, #808080 30%, #808080 60%, transparent 60%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}