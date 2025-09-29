'use client';

import { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

export function MobileRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('fountain-runner-highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const GROUND_Y = canvas.height - 80;
    const PLAYER_SIZE = 30;
    const OBSTACLE_WIDTH = 20;
    const OBSTACLE_HEIGHT = 40;

    let player = {
      x: 50,
      y: GROUND_Y - PLAYER_SIZE,
      velocityY: 0,
      isJumping: false,
      jumpForce: 0
    };

    let obstacles: Array<{ x: number; y: number }> = [];
    let gameScore = 0;
    let gameLives = 3;
    let lastObstacleTime = 0;
    let gameSpeed = 2;

    const gravity = 0.8;
    const jumpPower = -15;

    let keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !player.isJumping) {
        player.velocityY = jumpPower;
        player.isJumping = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (!player.isJumping) {
        player.velocityY = jumpPower;
        player.isJumping = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart);

    function gameLoop() {
      if (gameState !== 'playing') return;

      // Clear canvas
      ctx!.fillStyle = '#87CEEB';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Draw ground
      ctx!.fillStyle = '#90EE90';
      ctx!.fillRect(0, GROUND_Y, canvas!.width, canvas!.height - GROUND_Y);

      // Update player
      player.velocityY += gravity;
      player.y += player.velocityY;

      if (player.y >= GROUND_Y - PLAYER_SIZE) {
        player.y = GROUND_Y - PLAYER_SIZE;
        player.velocityY = 0;
        player.isJumping = false;
      }

      // Draw player
      ctx!.fillStyle = '#FF6B6B';
      ctx!.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

      // Spawn obstacles
      const currentTime = Date.now();
      if (currentTime - lastObstacleTime > 2000 - (gameScore * 10)) {
        obstacles.push({
          x: canvas!.width,
          y: GROUND_Y - OBSTACLE_HEIGHT
        });
        lastObstacleTime = currentTime;
      }

      // Update and draw obstacles
      obstacles = obstacles.filter(obstacle => {
        obstacle.x -= gameSpeed + Math.floor(gameScore / 100);

        ctx!.fillStyle = '#8B4513';
        ctx!.fillRect(obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);

        // Collision detection
        if (
          player.x < obstacle.x + OBSTACLE_WIDTH &&
          player.x + PLAYER_SIZE > obstacle.x &&
          player.y < obstacle.y + OBSTACLE_HEIGHT &&
          player.y + PLAYER_SIZE > obstacle.y
        ) {
          gameLives--;
          setLives(gameLives);
          if (gameLives <= 0) {
            setGameState('gameOver');
            if (gameScore > highScore) {
              setHighScore(gameScore);
              localStorage.setItem('fountain-runner-highscore', gameScore.toString());
            }
            return;
          }
          return obstacle.x > -OBSTACLE_WIDTH;
        }

        return obstacle.x > -OBSTACLE_WIDTH;
      });

      // Update score
      gameScore++;
      setScore(gameScore);

      // Draw UI
      ctx!.fillStyle = 'white';
      ctx!.font = '16px Arial';
      ctx!.fillText(`Score: ${gameScore}`, 10, 30);
      ctx!.fillText(`Lives: ${gameLives}`, 10, 50);

      requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
    };
  }, [gameState, highScore]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setLives(3);
  };

  if (gameState === 'menu') {
    return (
      <div className="h-full bg-gradient-to-b from-blue-400 to-green-400 flex items-center justify-center p-6">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">🏃‍♂️</h1>
          <h2 className="text-2xl font-bold mb-4">Fountain Runner</h2>
          <p className="mb-6">Tap to jump over wine bottles!</p>

          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy size={20} />
              <span className="font-semibold">High Score</span>
            </div>
            <div className="text-2xl font-bold">{highScore}</div>
          </div>

          <button
            onClick={startGame}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg mx-auto"
          >
            <Play size={20} />
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="h-full bg-gradient-to-b from-red-400 to-orange-400 flex items-center justify-center p-6">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <div className="bg-white/20 rounded-lg p-4 mb-4">
            <div className="text-lg mb-2">Final Score</div>
            <div className="text-3xl font-bold">{score}</div>
          </div>

          {score > highScore && (
            <div className="bg-yellow-400 text-yellow-900 rounded-lg p-3 mb-4">
              🎉 New High Score! 🎉
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full flex items-center justify-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-bold"
            >
              <Play size={16} />
              Try Again
            </button>
            <button
              onClick={resetGame}
              className="w-full flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-bold"
            >
              <RotateCcw size={16} />
              Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black flex flex-col">
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          style={{ touchAction: 'none' }}
        />
        <div className="absolute top-4 right-4 text-white text-sm">
          <div>Score: {score}</div>
          <div>Lives: {lives}</div>
        </div>
      </div>
      <div className="bg-gray-800 text-white p-4 text-center text-sm">
        Tap screen or press SPACE to jump
      </div>
    </div>
  );
}