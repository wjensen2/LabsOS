'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  playerY: number;
  playerVelocityY: number;
  isJumping: boolean;
  isHoldingJump: boolean;
  jumpHoldTime: number;
  obstacles: Array<{ x: number; y: number; id: number }>;
  collisions: number;
  showLeaderboard: boolean;
  showNameInput: boolean;
}

interface LeaderboardEntry {
  name: string;
  score: number;
}

export function MobileRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(0);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    playerY: 200,
    playerVelocityY: 0,
    isJumping: false,
    isHoldingJump: false,
    jumpHoldTime: 0,
    obstacles: [],
    collisions: 0,
    showLeaderboard: false,
    showNameInput: false,
  });

  // Game constants
  const GRAVITY = 0.8;
  const MIN_JUMP_FORCE = -8;
  const MAX_JUMP_FORCE = -18;
  const MAX_JUMP_HOLD_TIME = 15; // frames
  const GROUND_Y = 200;
  const PLAYER_X = 80;
  const PLAYER_SIZE = 20;
  const OBSTACLE_WIDTH = 15;
  const OBSTACLE_HEIGHT = 20;
  const GAME_SPEED = 3;
  const INITIAL_OBSTACLE_CHANCE = 0.008; // Start with less frequent obstacles
  const MAX_OBSTACLE_CHANCE = 0.025; // Maximum obstacle frequency

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fountain-runner-leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  // Save leaderboard to localStorage
  const saveLeaderboard = useCallback((newLeaderboard: LeaderboardEntry[]) => {
    localStorage.setItem('fountain-runner-leaderboard', JSON.stringify(newLeaderboard));
    setLeaderboard(newLeaderboard);
  }, []);

  // Handle jump input with variable height
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowUp' || e.key === ' ') && gameState.isPlaying && !gameState.isGameOver && !e.repeat) {
        e.preventDefault();
        setGameState(prev => {
          if (prev.playerY >= GROUND_Y - 5 && !prev.isHoldingJump) { // Only start jump if on ground and not already holding
            // For very quick taps, apply minimum jump immediately
            const quickJumpForce = MIN_JUMP_FORCE + (MAX_JUMP_FORCE - MIN_JUMP_FORCE) * 0.3; // 30% of max jump
            return {
              ...prev,
              isHoldingJump: true,
              jumpHoldTime: 0,
              isJumping: true,
              playerVelocityY: quickJumpForce, // Apply immediate jump force
            };
          }
          return prev;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowUp' || e.key === ' ') && gameState.isPlaying && !gameState.isGameOver) {
        e.preventDefault();
        setGameState(prev => {
          if (prev.isHoldingJump) {
            // If held for longer, apply additional jump force
            if (prev.jumpHoldTime > 5) { // Only boost if held for more than 5 frames
              const holdRatio = Math.min(prev.jumpHoldTime / MAX_JUMP_HOLD_TIME, 1);
              const additionalForce = (MAX_JUMP_FORCE - MIN_JUMP_FORCE) * holdRatio * 0.7; // 70% additional force

              return {
                ...prev,
                playerVelocityY: prev.playerVelocityY + additionalForce,
                isHoldingJump: false,
                jumpHoldTime: 0,
              };
            }

            return {
              ...prev,
              isHoldingJump: false,
              jumpHoldTime: 0,
            };
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.isPlaying, gameState.isGameOver]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    const gameLoop = () => {
      setGameState(prev => {
        const newState = { ...prev };

        // Update jump hold time if holding jump
        if (newState.isHoldingJump && newState.jumpHoldTime < MAX_JUMP_HOLD_TIME) {
          newState.jumpHoldTime += 1;
        }

        // Update player physics
        newState.playerVelocityY += GRAVITY;
        newState.playerY += newState.playerVelocityY;

        // Ground collision
        if (newState.playerY >= GROUND_Y) {
          newState.playerY = GROUND_Y;
          newState.playerVelocityY = 0;
          newState.isJumping = false;

          // If we're still holding jump and hit ground, reset to allow new jump
          if (newState.isHoldingJump) {
            newState.isHoldingJump = false;
            newState.jumpHoldTime = 0;
          }
        }

        // Update score
        newState.score += 1;

        // Progressive difficulty: obstacle frequency increases with score
        const difficultyProgress = Math.min(newState.score / 5000, 1); // Reach max difficulty at score 5000
        const currentObstacleChance = INITIAL_OBSTACLE_CHANCE + (MAX_OBSTACLE_CHANCE - INITIAL_OBSTACLE_CHANCE) * difficultyProgress;

        // Generate obstacles with progressive difficulty
        if (Math.random() < currentObstacleChance) {
          newState.obstacles.push({
            x: 800,
            y: GROUND_Y + PLAYER_SIZE, // Position bottles on the ground level
            id: Date.now() + Math.random(),
          });
        }

        // Update obstacles
        newState.obstacles = newState.obstacles
          .map(obstacle => ({ ...obstacle, x: obstacle.x - GAME_SPEED }))
          .filter(obstacle => obstacle.x > -OBSTACLE_WIDTH);

        // Collision detection
        newState.obstacles.forEach(obstacle => {
          const playerLeft = PLAYER_X;
          const playerRight = PLAYER_X + PLAYER_SIZE;
          const playerTop = newState.playerY;
          const playerBottom = newState.playerY + PLAYER_SIZE;

          const obstacleLeft = obstacle.x;
          const obstacleRight = obstacle.x + OBSTACLE_WIDTH;
          const obstacleTop = obstacle.y - OBSTACLE_HEIGHT; // Top of bottle
          const obstacleBottom = obstacle.y; // Bottom of bottle (on ground)

          if (
            playerRight > obstacleLeft &&
            playerLeft < obstacleRight &&
            playerBottom > obstacleTop &&
            playerTop < obstacleBottom
          ) {
            newState.collisions += 1;
            // Remove the collided obstacle
            newState.obstacles = newState.obstacles.filter(obs => obs.id !== obstacle.id);

            if (newState.collisions >= 3) {
              newState.isGameOver = true;
              newState.showNameInput = true;
            }
          }
        });

        return newState;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isGameOver]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, GROUND_Y + PLAYER_SIZE, canvas.width, canvas.height - GROUND_Y - PLAYER_SIZE);

    if (gameState.isPlaying) {
      // Draw player (simple pixelated character)
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(PLAYER_X, gameState.playerY, PLAYER_SIZE, PLAYER_SIZE);

      // Player face
      ctx.fillStyle = '#000';
      ctx.fillRect(PLAYER_X + 5, gameState.playerY + 5, 3, 3);
      ctx.fillRect(PLAYER_X + 12, gameState.playerY + 5, 3, 3);
      ctx.fillRect(PLAYER_X + 7, gameState.playerY + 12, 6, 2);

      // Draw obstacles (wine bottles)
      ctx.fillStyle = '#8B4513';
      gameState.obstacles.forEach(obstacle => {
        // Bottle body
        ctx.fillRect(obstacle.x, obstacle.y - OBSTACLE_HEIGHT, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
        // Bottle neck
        ctx.fillRect(obstacle.x + 4, obstacle.y - OBSTACLE_HEIGHT - 5, 7, 5);
        // Label
        ctx.fillStyle = '#FFF';
        ctx.fillRect(obstacle.x + 2, obstacle.y - 15, 11, 8);
        ctx.fillStyle = '#8B4513';
      });
    }

    // Draw UI
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    ctx.fillText(`Lives: ${3 - gameState.collisions}`, 10, 50);

    if (!gameState.isPlaying && !gameState.isGameOver) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('FOUNTAIN RUNNER', canvas.width / 2 - 120, canvas.height / 2 - 40);
      ctx.font = '16px monospace';
      ctx.fillText('Press SPACE or UP arrow to jump over wine bottles!', canvas.width / 2 - 200, canvas.height / 2);
      ctx.fillText('Avoid 3 collisions to keep running!', canvas.width / 2 - 140, canvas.height / 2 + 20);
    }

  }, [gameState]);

  const startGame = () => {
    setGameState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      playerY: GROUND_Y,
      playerVelocityY: 0,
      isJumping: false,
      isHoldingJump: false,
      jumpHoldTime: 0,
      obstacles: [],
      collisions: 0,
      showLeaderboard: false,
      showNameInput: false,
    });
  };

  const restartGame = () => {
    startGame();
  };

  const submitScore = () => {
    if (playerName.length === 3) {
      const newEntry = { name: playerName.toUpperCase(), score: gameState.score };
      const newLeaderboard = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      saveLeaderboard(newLeaderboard);
      setPlayerName('');
      setGameState(prev => ({
        ...prev,
        showNameInput: false,
        showLeaderboard: true,
      }));
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-white font-mono">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="border-2 border-gray-400 bg-sky-200"
          style={{ imageRendering: 'pixelated' }}
        />

        <div className="mt-4 flex flex-col items-center gap-4">
          {!gameState.isPlaying && !gameState.isGameOver && (
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
            >
              START GAME
            </button>
          )}

          {gameState.isGameOver && gameState.showNameInput && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-red-400">GAME OVER!</h2>
              <p className="mb-4">Final Score: {gameState.score}</p>
              <p className="mb-2">Enter your initials (3 characters):</p>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 3).toUpperCase())}
                className="px-3 py-2 bg-gray-800 border border-gray-600 text-white text-center text-xl font-bold w-20 mr-2"
                maxLength={3}
                autoFocus
              />
              <button
                onClick={submitScore}
                disabled={playerName.length !== 3}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold rounded"
              >
                SUBMIT
              </button>
            </div>
          )}

          {gameState.showLeaderboard && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">TOP 10 LEADERBOARD</h2>
              <div className="bg-gray-800 p-4 rounded border-2 border-gray-600 min-w-64">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>{index + 1}. {entry.name}</span>
                    <span>{entry.score}</span>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-gray-400">No scores yet!</p>
                )}
              </div>
              <button
                onClick={restartGame}
                className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
              >
                PLAY AGAIN
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>HOLD UP ARROW or SPACEBAR for higher jumps</p>
          <p>Tap quickly for small hops • Hold longer for big jumps</p>
          <p>Avoid wine bottles • 3 hits = Game Over</p>
        </div>
      </div>
    </div>
  );
}