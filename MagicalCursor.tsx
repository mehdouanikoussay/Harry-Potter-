import { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

export const MagicalCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);

    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouch) return;

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

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });

      // Keep only recent points
      const now = Date.now();
      trailRef.current = trailRef.current.filter(p => now - p.timestamp < 500);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const trail = trailRef.current;
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let i = 1; i < trail.length; i++) {
          const point = trail[i];
          const prevPoint = trail[i - 1];
          const midX = (prevPoint.x + point.x) / 2;
          const midY = (prevPoint.y + point.y) / 2;
          ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
        }

        ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);

        // Create gradient
        const gradient = ctx.createLinearGradient(
          trail[0].x, trail[0].y,
          trail[trail.length - 1].x, trail[trail.length - 1].y
        );
        gradient.addColorStop(0, 'rgba(200, 161, 78, 0)');
        gradient.addColorStop(0.5, 'rgba(200, 161, 78, 0.3)');
        gradient.addColorStop(1, 'rgba(200, 161, 78, 0.6)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Add glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#C8A14E';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw cursor glow
      const mouse = mouseRef.current;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#C8A14E';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 161, 78, 0.3)';
      ctx.fill();

      const frameId = requestAnimationFrame(animate);
      animationRef.current = frameId;
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};