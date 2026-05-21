import { useEffect, useRef } from 'react';

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
}

export default function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Resize canvas
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles creation
    const colors = ['#a3e635', '#f97316', '#3b82f6', '#ec4899', '#eab308', '#22c55e', '#a855f7'];
    const particles: Particle[] = [];
    
    // Generate particles from two side bursts (like standard confetti)
    const createBurst = (x: number, angleRange: [number, number]) => {
      const count = 60;
      for (let i = 0; i < count; i++) {
        const angle = angleRange[0] + Math.random() * (angleRange[1] - angleRange[0]);
        const speed = 10 + Math.random() * 15;
        particles.push({
          x: x,
          y: canvas.height,
          vx: Math.cos(angle) * speed,
          vy: -Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: -0.1 + Math.random() * 0.2,
          opacity: 1,
        });
      }
    };

    // Left and right bursts
    createBurst(0, [Math.PI / 6, Math.PI / 3]); // angle 30 to 60 deg
    createBurst(canvas.width, [Math.PI * 2 / 3, Math.PI * 5 / 6]); // angle 120 to 150 deg

    const gravity = 0.35;
    const friction = 0.98;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeParticles = 0;

      particles.forEach((p) => {
        p.vx *= friction;
        p.vy *= friction;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        
        // Fade out as it goes down or after some time
        if (p.y > canvas.height * 0.6) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0) {
          activeParticles++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          
          // Draw rect
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
    />
  );
}
