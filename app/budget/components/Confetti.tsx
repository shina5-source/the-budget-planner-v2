'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  spread?: 'full' | 'center' | 'burst';
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'square' | 'circle' | 'ribbon';
  wobble: number;
  wobbleSpeed: number;
}

export function Confetti({ 
  trigger, 
  duration = 3000, 
  particleCount = 60,
  colors = ['#D4AF37', '#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'],
  spread = 'full',
  onComplete 
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const createParticle = useCallback((canvasWidth: number, canvasHeight: number): Particle => {
    const shapes: ('square' | 'circle' | 'ribbon')[] = ['square', 'circle', 'ribbon'];
    
    let startX: number;
    let startY: number;
    let vx: number;
    let vy: number;

    switch (spread) {
      case 'center':
        startX = canvasWidth / 2 + (Math.random() - 0.5) * 100;
        startY = canvasHeight / 2;
        vx = (Math.random() - 0.5) * 12;
        vy = (Math.random() - 0.8) * 10;
        break;
      case 'burst':
        startX = canvasWidth / 2;
        startY = canvasHeight / 3;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed - 3;
        break;
      default:
        startX = Math.random() * canvasWidth;
        startY = -20;
        vx = (Math.random() - 0.5) * 6;
        vy = Math.random() * 3 + 2;
    }

    return {
      x: startX,
      y: startY,
      vx,
      vy,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      opacity: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      wobble: Math.random() * 10,
      wobbleSpeed: Math.random() * 0.1 + 0.05
    };
  }, [colors, spread]);

  const cleanup = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    particlesRef.current = [];
    isRunningRef.current = false;
  }, []);

  useEffect(() => {
    if (!trigger) {
      cleanup();
      return;
    }

    if (isRunningRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    particlesRef.current = Array.from(
      { length: particleCount }, 
      () => createParticle(canvas.width, canvas.height)
    );

    startTimeRef.current = performance.now();
    isRunningRef.current = true;

    const animate = (timestamp: number) => {
      if (!isRunningRef.current) return;
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Physics
        particle.vy += 0.15;
        particle.vx *= 0.99;
        particle.x += particle.vx + Math.sin(particle.wobble) * 2;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.wobble += particle.wobbleSpeed;
        
        // Fade out
        if (progress > 0.6) {
          particle.opacity = Math.max(0, 1 - ((progress - 0.6) / 0.4));
        }

        // Draw
        if (particle.opacity > 0 && particle.y < canvas.height + 50) {
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;

          switch (particle.shape) {
            case 'square':
              ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
              break;
            case 'circle':
              ctx.beginPath();
              ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'ribbon':
              ctx.fillRect(-particle.size / 2, -particle.size / 6, particle.size, particle.size / 3);
              break;
          }

          ctx.restore();
        }
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        cleanup();
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cleanup();
    };
  }, [trigger, duration, particleCount, createParticle, cleanup, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  if (!trigger && !isRunningRef.current) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
}
