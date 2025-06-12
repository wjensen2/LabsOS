'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const noise = (x: number, y: number, time: number) => {
      return Math.sin(x * 0.01 + time * 0.001) * 
             Math.cos(y * 0.01 + time * 0.002) * 
             Math.sin((x + y) * 0.005 + time * 0.0015);
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      const baseHue1 = 220 + Math.sin(time * 0.001) * 30;
      const baseHue2 = 280 + Math.cos(time * 0.0008) * 40;
      const baseHue3 = 320 + Math.sin(time * 0.0012) * 25;

      const mouseInfluence = Math.min(
        Math.sqrt(mousePos.x * mousePos.x + mousePos.y * mousePos.y) / 1000,
        1
      );

      gradient.addColorStop(0, `hsl(${baseHue1 + mouseInfluence * 20}, 70%, 60%)`);
      gradient.addColorStop(0.5, `hsl(${baseHue2 + mouseInfluence * 15}, 80%, 50%)`);
      gradient.addColorStop(1, `hsl(${baseHue3 + mouseInfluence * 10}, 75%, 45%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % canvas.width;
        const y = Math.floor(i / 4 / canvas.width);
        
        const noiseValue = noise(x, y, time) * 30;
        
        data[i] = Math.min(255, Math.max(0, data[i] + noiseValue));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noiseValue * 0.8));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noiseValue * 1.2));
      }

      ctx.putImageData(imageData, 0, 0);

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos.x, mousePos.y]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}