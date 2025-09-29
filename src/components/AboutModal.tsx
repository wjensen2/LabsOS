'use client';

import { X, Info, Code, Calendar, GitBranch } from 'lucide-react';
import Image from 'next/image';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed bg-gray-200 border-4 border-gray-400 shadow-lg z-50"
      style={{
        width: '520px',
        height: '600px',
        top: '80px',
        left: '250px',
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
            <Info size={16} className="text-white" />
            <span className="text-white font-bold text-sm">About Fountain Labs OS</span>
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
          {/* Header with Logo */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded border-2 border-blue-300">
              <Image src="/rocket.png" alt="Fountain Labs" width={48} height={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Fountain Labs OS</h2>
              <p className="text-sm text-gray-600">Virtual Desktop Environment v2.1</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border-2 border-gray-400 p-6 mb-6"
            style={{
              boxShadow: 'inset -1px -1px 0 #ffffff, inset 1px 1px 0 #808080'
            }}>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Info size={16} className="text-blue-600" />
              About This Environment
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Fountain Labs OS is a nostalgic virtual desktop environment that recreates the charm
              of classic operating systems while showcasing modern web technologies. This interactive
              experience demonstrates our team&apos;s capabilities in creating immersive digital experiences
              for the CHRO Summit 2025.
            </p>
            <p className="text-sm text-gray-700">
              The environment features fully functional applications including project management,
              team directory, AI assistance, document viewing, presentations, and even a retro-style
              runner game - all optimized for both desktop and mobile experiences.
            </p>
          </div>

          {/* Technical Details */}
          <div className="bg-white border-2 border-gray-400 p-6 mb-6"
            style={{
              boxShadow: 'inset -1px -1px 0 #ffffff, inset 1px 1px 0 #808080'
            }}>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code size={16} className="text-blue-600" />
              Built With
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span>Framework:</span>
                <span className="font-mono">Next.js 14 with React 18</span>
              </div>
              <div className="flex justify-between">
                <span>Styling:</span>
                <span className="font-mono">Tailwind CSS</span>
              </div>
              <div className="flex justify-between">
                <span>Animations:</span>
                <span className="font-mono">Framer Motion</span>
              </div>
              <div className="flex justify-between">
                <span>Icons:</span>
                <span className="font-mono">Lucide React</span>
              </div>
              <div className="flex justify-between">
                <span>Language:</span>
                <span className="font-mono">TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span>AI Integration:</span>
                <span className="font-mono">Claude API</span>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="bg-white border-2 border-gray-400 p-6 mb-6"
            style={{
              boxShadow: 'inset -1px -1px 0 #ffffff, inset 1px 1px 0 #808080'
            }}>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <GitBranch size={16} className="text-blue-600" />
              Version Information
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="font-mono">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Latest Commit:</span>
                <span className="font-mono text-xs">858353c - Add mobile-optimized virtual desktop experience</span>
              </div>
              <div className="flex justify-between">
                <span>Build Date:</span>
                <span className="font-mono">{new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-600 mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar size={12} />
              <span>© 2025 Fountain Labs. Created for CHRO Summit 2025.</span>
            </div>
            <p>Designed with ❤️ for the future of work.</p>
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