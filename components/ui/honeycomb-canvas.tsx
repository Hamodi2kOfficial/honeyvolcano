"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive "honey cells" background. A canvas hex grid that breathes with a
 * slow gold wave and lights up around the pointer. Pointer-events-none so it
 * never blocks UI; honours prefers-reduced-motion (renders a single static grid).
 */
export function HoneycombCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const r = 30;
    const hstep = r * 1.5;
    const vstep = r * Math.sqrt(3);

    const verts: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i);
      verts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }

    let width = 0;
    let height = 0;
    let cells: { x: number; y: number; ph: number }[] = [];
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = [];
      const cols = Math.ceil(width / hstep) + 2;
      const rows = Math.ceil(height / vstep) + 2;
      for (let c = -1; c <= cols; c++) {
        for (let rr = -1; rr <= rows; rr++) {
          const x = c * hstep;
          const y = rr * vstep + (c % 2 ? vstep / 2 : 0);
          cells.push({ x, y, ph: (x + y) * 0.012 });
        }
      }
    };

    const hexPath = (x: number, y: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const vx = x + verts[i][0];
        const vy = y + verts[i][1];
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    };

    let raf = 0;
    const R = 190;
    const frame = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      for (const cell of cells) {
        const amb = 0.5 + 0.5 * Math.sin(t * 0.0006 + cell.ph);
        let a = 0.045 + 0.05 * amb;
        const dx = cell.x - mouse.x;
        const dy = cell.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < R) {
          const prox = 1 - d / R;
          a += prox * prox * 0.55;
          hexPath(cell.x, cell.y);
          ctx.fillStyle = `rgba(229,184,105,${(prox * prox * 0.13).toFixed(3)})`;
          ctx.fill();
        }
        hexPath(cell.x, cell.y);
        ctx.strokeStyle = `rgba(212,175,55,${Math.min(a, 0.8).toFixed(3)})`;
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(212,175,55,0.06)";
      for (const cell of cells) {
        hexPath(cell.x, cell.y);
        ctx.stroke();
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    build();
    if (reduce) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) drawStatic();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
