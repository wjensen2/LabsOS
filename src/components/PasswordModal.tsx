'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PasswordModalProps {
  isVisible: boolean;
  onPasswordCorrect: () => void;
}

export function PasswordModal({ isVisible, onPasswordCorrect }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'napa2025') {
      setIsAuthenticated(true);
      // Delay to allow fade animation
      setTimeout(() => {
        onPasswordCorrect();
      }, 1000);
    } else {
      setError('Access Denied. Please try again.');
      setPassword('');
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isAuthenticated ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50 font-mono"
    >
      <div className="w-full max-w-2xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          {/* CHRO SUMMIT ASCII Art */}
          <div className="text-orange-500 font-mono text-base leading-tight mb-6 whitespace-pre">
{`██████╗██╗  ██╗██████╗  ██████╗
██╔════╝██║  ██║██╔══██╗██╔═══██╗
██║     ███████║██████╔╝██║   ██║
██║     ██╔══██║██╔══██╗██║   ██║
╚██████╗██║  ██║██║  ██║╚██████╔╝
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝

███████╗██╗   ██╗███╗   ███╗███╗   ███╗██╗████████╗
██╔════╝██║   ██║████╗ ████║████╗ ████║██║╚══██╔══╝
███████╗██║   ██║██╔████╔██║██╔████╔██║██║   ██║
╚════██║██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║
███████║╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║
╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝`}
          </div>

          {/* Welcome Message */}
          <div className="text-green-400 text-sm mb-6">
            <div className="mb-2">Welcome to the Fountain CHRO Summit 2025!</div>
            <div>Before accessing the virtual desktop, please enter the event password below.</div>
          </div>

          {/* Terminal-style Input */}
          <form onSubmit={handleSubmit} className="text-left">
            <div className="text-green-400 text-sm mb-2">Password:</div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <div className="relative flex items-center">
                <span className="text-green-400 font-mono text-sm">
                  {'•'.repeat(password.length)}
                </span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-green-400"
                >
                  █
                </motion.span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="absolute inset-0 opacity-0 bg-transparent border-none outline-none cursor-text w-full"
                  autoFocus
                />
              </div>
            </div>
            <div className="h-0.5 bg-green-400 w-96 mt-1"></div>
          </form>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-4 font-mono"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-sm mt-4 font-mono"
            >
              Access Granted. Loading desktop environment...
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}