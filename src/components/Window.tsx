'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import { ReactNode } from 'react';

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
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="window-frame absolute z-10"
          style={{
            left: x,
            top: y,
            width,
            height,
          }}
        >
          {/* Title Bar */}
          <div className="window-title-bar flex items-center justify-between">
            <span className="text-white font-bold">{title}</span>
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
          <div className="p-4 h-full overflow-auto" style={{ height: `calc(100% - 24px)` }}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}