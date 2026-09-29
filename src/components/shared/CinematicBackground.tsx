import React, { useEffect, useRef } from 'react';

interface CinematicBackgroundProps {
  mouseX?: number;
  mouseY?: number;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  mouseX = 0,
  mouseY = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating particles array
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      depth: Math.random() * 0.8 + 0.2,
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(0.4, '#0f172a');
      bgGrad.addColorStop(0.8, '#0b1329');
      bgGrad.addColorStop(1, '#050811');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Parallax offsets based on mouse
      const offsetX = mouseX * 30;
      const offsetY = mouseY * 30;

      // Ambient glowing light shafts
      const glow1X = width * 0.3 + Math.sin(time * 0.5) * 60 + offsetX * 0.2;
      const glow1Y = height * 0.25 + Math.cos(time * 0.4) * 40 + offsetY * 0.2;
      const radGrad1 = ctx.createRadialGradient(glow1X, glow1Y, 10, glow1X, glow1Y, 450);
      radGrad1.addColorStop(0, 'rgba(79, 70, 229, 0.22)');
      radGrad1.addColorStop(0.5, 'rgba(20, 184, 166, 0.08)');
      radGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad1;
      ctx.beginPath();
      ctx.arc(glow1X, glow1Y, 450, 0, Math.PI * 2);
      ctx.fill();

      const glow2X = width * 0.75 - Math.cos(time * 0.6) * 50 - offsetX * 0.3;
      const glow2Y = height * 0.7 + Math.sin(time * 0.5) * 50 - offsetY * 0.3;
      const radGrad2 = ctx.createRadialGradient(glow2X, glow2Y, 10, glow2X, glow2Y, 500);
      radGrad2.addColorStop(0, 'rgba(14, 165, 233, 0.18)');
      radGrad2.addColorStop(0.5, 'rgba(99, 102, 241, 0.06)');
      radGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad2;
      ctx.beginPath();
      ctx.arc(glow2X, glow2Y, 500, 0, Math.PI * 2);
      ctx.fill();

      // Render floating depth particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pOffsetX = offsetX * p.depth;
        const pOffsetY = offsetY * p.depth;

        ctx.beginPath();
        ctx.arc(p.x + pOffsetX, p.y + pOffsetY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha * 0.7})`;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Decorative CSS 3D Geometries with mouse parallax */}
      <div
        className="absolute top-12 left-10 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(13,148,136,0.1) 70%, transparent 100%)',
          transform: `translate3d(${mouseX * -40}px, ${mouseY * -40}px, 0)`,
        }}
      />

      <div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.35) 0%, rgba(168,85,247,0.1) 70%, transparent 100%)',
          transform: `translate3d(${mouseX * 50}px, ${mouseY * 50}px, 0)`,
        }}
      />
    </div>
  );
};
