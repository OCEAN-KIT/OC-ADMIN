"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface NotFoundSceneProps {
  message?: string;
}

export default function NotFoundScene({
  message = "요청하신 페이지가 깊은 바다 속으로 사라졌어요",
}: NotFoundSceneProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      life: number;
      maxLife: number;
    }[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() * 60 + 180,
        life: Math.random() * 1000,
        maxLife: 1000 + Math.random() * 2000,
      });
    }

    const orbs: {
      x: number;
      y: number;
      radius: number;
      phase: number;
      speed: number;
      hue: number;
    }[] = [];

    for (let i = 0; i < 6; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 80 + 40,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.005 + 0.002,
        hue: Math.random() * 40 + 190,
      });
    }

    let time = 0;

    const draw = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#020b1a");
      grad.addColorStop(0.3, "#041430");
      grad.addColorStop(0.6, "#0a2a5e");
      grad.addColorStop(1, "#0f3d6e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 3; i++) {
        const gx = w * 0.3 + Math.sin(time * 0.3 + i * 2) * w * 0.3;
        const gy = h * 0.2 + Math.cos(time * 0.2 + i) * h * 0.15;
        const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 400 + i * 100);
        rg.addColorStop(
          0,
          `hsla(${200 + i * 20 + Math.sin(time) * 10}, 80%, 60%, 0.06)`,
        );
        rg.addColorStop(0.5, `hsla(${220 + i * 15}, 70%, 40%, 0.03)`);
        rg.addColorStop(1, "transparent");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);
      }

      const mouseGrad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        300,
      );
      mouseGrad.addColorStop(0, "rgba(100, 180, 255, 0.07)");
      mouseGrad.addColorStop(0.5, "rgba(60, 140, 220, 0.03)");
      mouseGrad.addColorStop(1, "transparent");
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, w, h);

      for (const orb of orbs) {
        orb.phase += orb.speed;
        orb.x += Math.sin(orb.phase) * 0.8;
        orb.y += Math.cos(orb.phase * 0.7) * 0.5 - 0.15;

        if (orb.y < -orb.radius * 2) orb.y = h + orb.radius;
        if (orb.x < -orb.radius * 2) orb.x = w + orb.radius;
        if (orb.x > w + orb.radius * 2) orb.x = -orb.radius;

        const pulse = Math.sin(orb.phase * 2) * 0.3 + 0.7;
        const og = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius,
        );
        og.addColorStop(0, `hsla(${orb.hue}, 80%, 70%, ${0.12 * pulse})`);
        og.addColorStop(
          0.4,
          `hsla(${orb.hue + 10}, 60%, 50%, ${0.06 * pulse})`,
        );
        og.addColorStop(1, "transparent");
        ctx.fillStyle = og;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of particles) {
        p.life += 1;
        if (p.life > p.maxLife) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.life = 0;
        }

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          p.vx += (dx / dist) * 0.02;
          p.vy += (dy / dist) * 0.02;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy + Math.sin(time + p.x * 0.01) * 0.3;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const fadeIn = Math.min(p.life / 60, 1);
        const fadeOut = Math.min((p.maxLife - p.life) / 60, 1);
        const alpha = p.opacity * fadeIn * fadeOut;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${alpha})`;
        ctx.fill();

        if (p.size > 2) {
          const pg = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size * 4,
          );
          pg.addColorStop(0, `hsla(${p.hue}, 90%, 80%, ${alpha * 0.3})`);
          pg.addColorStop(1, "transparent");
          ctx.fillStyle = pg;
          ctx.fillRect(
            p.x - p.size * 4,
            p.y - p.size * 4,
            p.size * 8,
            p.size * 8,
          );
        }
      }

      ctx.strokeStyle = "rgba(100, 180, 255, 0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.globalAlpha = 1 - dist / 100;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 60px)",
        overflow: "hidden",
        background: "#020b1a",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: "8px",
        }}
      >
        <div className="notfound-title" style={{ position: "relative" }}>
          <span
            style={{
              fontSize: "clamp(100px, 15vw, 200px)",
              fontWeight: 900,
              color: "transparent",
              background:
                "linear-gradient(135deg, #64b5f6 0%, #e0f7fa 30%, #4fc3f7 50%, #81d4fa 70%, #b3e5fc 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              letterSpacing: "-8px",
              lineHeight: 1,
              filter: "drop-shadow(0 0 40px rgba(100, 180, 255, 0.4))",
              fontFamily:
                "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            404
          </span>
        </div>

        <div
          style={{
            width: "80px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.6), transparent)",
            margin: "16px 0",
          }}
        />

        <p
          style={{
            fontSize: "clamp(16px, 2.5vw, 24px)",
            color: "rgba(180, 220, 255, 0.9)",
            fontWeight: 300,
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Page Not Found
        </p>

        <p
          style={{
            fontSize: "clamp(13px, 1.5vw, 16px)",
            color: "rgba(140, 180, 220, 0.6)",
            fontWeight: 400,
            marginTop: "4px",
            fontFamily:
              "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {message}
        </p>

        <button
          onClick={() => router.push("/home")}
          style={{
            marginTop: "40px",
            padding: "14px 40px",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(200, 230, 255, 0.9)",
            background: "rgba(100, 180, 255, 0.08)",
            border: "1px solid rgba(100, 180, 255, 0.2)",
            borderRadius: "60px",
            cursor: "pointer",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: "blur(20px)",
            fontFamily:
              "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(100, 180, 255, 0.18)";
            e.currentTarget.style.borderColor = "rgba(100, 180, 255, 0.5)";
            e.currentTarget.style.boxShadow =
              "0 0 40px rgba(100, 180, 255, 0.15), inset 0 0 40px rgba(100, 180, 255, 0.05)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(100, 180, 255, 0.08)";
            e.currentTarget.style.borderColor = "rgba(100, 180, 255, 0.2)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          메인으로 돌아가기
        </button>
      </div>

      <style>{`
        @keyframes glitch {
          0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
          20% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 2px); }
          40% { clip-path: inset(40% 0 30% 0); transform: translate(2px, -1px); }
          60% { clip-path: inset(60% 0 10% 0); transform: translate(-1px, 1px); }
          80% { clip-path: inset(10% 0 80% 0); transform: translate(1px, -2px); }
        }

        .notfound-title::before,
        .notfound-title::after {
          content: '404';
          position: absolute;
          top: 0;
          left: 0;
          font-size: clamp(100px, 15vw, 200px);
          font-weight: 900;
          letter-spacing: -8px;
          line-height: 1;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .notfound-title::before {
          color: rgba(100, 200, 255, 0.08);
          animation: glitch 8s ease-in-out infinite;
          text-shadow: 2px 0 #4fc3f7;
        }

        .notfound-title::after {
          color: rgba(255, 100, 150, 0.05);
          animation: glitch 8s ease-in-out infinite reverse;
          text-shadow: -2px 0 #f48fb1;
        }
      `}</style>
    </div>
  );
}
