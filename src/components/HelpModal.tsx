'use client';

import { X, HelpCircle, Mail } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed bg-gray-200 border-4 border-gray-400 shadow-lg z-50"
      style={{
        width: '480px',
        height: '420px',
        top: '120px',
        left: '200px',
        boxShadow: 'inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080, 4px 4px 8px rgba(0,0,0,0.3)'
      }}
    >
        {/* Title Bar */}
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-400 px-3 py-2 flex items-center justify-between border-b-2 border-gray-400"
          style={{
            background: 'linear-gradient(90deg, #0066cc 0%, #0080ff 100%)'
          }}
        >
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-white" />
            <span className="text-white font-bold text-sm">Fountain Labs OS - Help</span>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 border border-gray-500 w-6 h-6 flex items-center justify-center text-xs font-bold"
            style={{
              boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080'
            }}
          >
            <X size={12} />
          </button>
        </div>

        {/* Content */}
        <div className="px-12 py-8" style={{ height: 'calc(100% - 44px)', overflowY: 'auto' }}>
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full border-2 border-blue-300">
              <HelpCircle size={32} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Need Help?</h2>
              <p className="text-sm text-gray-700">
                Welcome to Fountain Labs OS! We&apos;re here to help with any questions,
                suggestions, concerns, or even high fives about our virtual desktop environment.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-400 p-6 mb-6"
            style={{
              boxShadow: 'inset -1px -1px 0 #ffffff, inset 1px 1px 0 #808080'
            }}>
            <div className="flex items-center gap-3 mb-3">
              <Mail size={20} className="text-blue-600" />
              <span className="font-bold text-gray-800">Contact Information</span>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p>For any assistance with Fountain Labs OS, please reach out to:</p>
              <div className="bg-gray-100 p-3 border border-gray-300 font-mono text-center">
                <a
                  href="mailto:will@fountain.com"
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  will@fountain.com
                </a>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                • Questions about features or functionality<br/>
                • Suggestions for improvements<br/>
                • Technical concerns or issues<br/>
                • General feedback and high fives! 🙌
              </p>
            </div>
          </div>

          {/* OK Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-2 bg-gray-300 hover:bg-gray-400 border-2 border-gray-500 font-bold text-sm"
              style={{
                boxShadow: 'inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = 'inset -2px -2px 0 #ffffff, inset 2px 2px 0 #808080';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = 'inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'inset 2px 2px 0 #ffffff, inset -2px -2px 0 #808080';
              }}
            >
              OK
            </button>
          </div>
        </div>
    </div>
  );
}