"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import "./shape-grid.css";

export type ShapeGridDirection =
  | "diagonal"
  | "up"
  | "right"
  | "down"
  | "left";

export type ShapeGridShape = "square" | "hexagon" | "circle" | "triangle";

export interface ShapeGridProps {
  direction?: ShapeGridDirection;
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  /** Color de la celda activa bajo el cursor */
  hoverColor?: string;
  shape?: ShapeGridShape;
  hoverTrailAmount?: number;
  className?: string;
}

interface GridCell {
  x: number;
  y: number;
}

export function ShapeGrid({
  direction = "right",
  speed = 1,
  borderColor = "#999",
  squareSize = 40,
  hoverFillColor = "#222",
  hoverColor = "#A855F7",
  shape = "square",
  hoverTrailAmount = 0,
  className,
}: ShapeGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef(0);
  const numSquaresY = useRef(0);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef<GridCell | null>(null);
  const trailCells = useRef<GridCell[]>([]);
  const cellOpacities = useRef(new Map<string, number>());
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry?.isIntersecting ?? false),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isHex = shape === "hexagon";
    const isTri = shape === "triangle";
    const hexHoriz = squareSize * 1.5;
    const hexVert = squareSize * Math.sqrt(3);
    let logicalWidth = 0;
    let logicalHeight = 0;

    const resolveFillColor = () => hoverColor;

    const resizeCanvas = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        window.innerWidth < 768 ? 1.5 : 2,
      );
      logicalWidth = canvas.offsetWidth;
      logicalHeight = canvas.offsetHeight;
      canvas.width = Math.floor(logicalWidth * dpr);
      canvas.height = Math.floor(logicalHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      numSquaresX.current = Math.ceil(logicalWidth / squareSize) + 1;
      numSquaresY.current = Math.ceil(logicalHeight / squareSize) + 1;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawHex = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const vx = cx + size * Math.cos(angle);
        const vy = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    };

    const drawCircle = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.closePath();
    };

    const drawTriangle = (
      cx: number,
      cy: number,
      size: number,
      flip: boolean,
    ) => {
      ctx.beginPath();
      if (flip) {
        ctx.moveTo(cx, cy + size / 2);
        ctx.lineTo(cx + size / 2, cy - size / 2);
        ctx.lineTo(cx - size / 2, cy - size / 2);
      } else {
        ctx.moveTo(cx, cy - size / 2);
        ctx.lineTo(cx + size / 2, cy + size / 2);
        ctx.lineTo(cx - size / 2, cy + size / 2);
      }
      ctx.closePath();
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      if (isHex) {
        const colShift = Math.floor(gridOffset.current.x / hexHoriz);
        const offsetX =
          ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz;
        const offsetY =
          ((gridOffset.current.y % hexVert) + hexVert) % hexVert;

        const cols = Math.ceil(logicalWidth / hexHoriz) + 3;
        const rows = Math.ceil(logicalHeight / hexVert) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * hexHoriz + offsetX;
            const cy =
              row * hexVert +
              ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) +
              offsetY;

            const cellKey = `${col},${row}`;
            const alpha = cellOpacities.current.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawHex(cx, cy, squareSize);
              ctx.fillStyle = resolveFillColor();
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            drawHex(cx, cy, squareSize);
            ctx.strokeStyle = borderColor;
            ctx.stroke();
          }
        }
      } else if (isTri) {
        const halfW = squareSize / 2;
        const colShift = Math.floor(gridOffset.current.x / halfW);
        const rowShift = Math.floor(gridOffset.current.y / squareSize);
        const offsetX =
          ((gridOffset.current.x % halfW) + halfW) % halfW;
        const offsetY =
          ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const cols = Math.ceil(logicalWidth / halfW) + 4;
        const rows = Math.ceil(logicalHeight / squareSize) + 4;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * halfW + offsetX;
            const cy = row * squareSize + squareSize / 2 + offsetY;
            const flip =
              (((col + colShift + row + rowShift) % 2) + 2) % 2 !== 0;

            const cellKey = `${col},${row}`;
            const alpha = cellOpacities.current.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawTriangle(cx, cy, squareSize, flip);
              ctx.fillStyle = resolveFillColor();
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            drawTriangle(cx, cy, squareSize, flip);
            ctx.strokeStyle = borderColor;
            ctx.stroke();
          }
        }
      } else if (shape === "circle") {
        const offsetX =
          ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
        const offsetY =
          ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const cols = Math.ceil(logicalWidth / squareSize) + 3;
        const rows = Math.ceil(logicalHeight / squareSize) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * squareSize + squareSize / 2 + offsetX;
            const cy = row * squareSize + squareSize / 2 + offsetY;

            const cellKey = `${col},${row}`;
            const alpha = cellOpacities.current.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawCircle(cx, cy, squareSize);
              ctx.fillStyle = resolveFillColor();
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            drawCircle(cx, cy, squareSize);
            ctx.strokeStyle = borderColor;
            ctx.stroke();
          }
        }
      } else {
        const offsetX =
          ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
        const offsetY =
          ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const cols = Math.ceil(logicalWidth / squareSize) + 3;
        const rows = Math.ceil(logicalHeight / squareSize) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const sx = col * squareSize + offsetX;
            const sy = row * squareSize + offsetY;

            const cellKey = `${col},${row}`;
            const alpha = cellOpacities.current.get(cellKey);
            if (alpha) {
              ctx.globalAlpha = alpha;
              ctx.fillStyle = resolveFillColor();
              ctx.fillRect(sx, sy, squareSize, squareSize);
              ctx.globalAlpha = 1;
            }

            ctx.strokeStyle = borderColor;
            ctx.strokeRect(sx, sy, squareSize, squareSize);
          }
        }
      }

      const gradient = ctx.createRadialGradient(
        logicalWidth / 2,
        logicalHeight / 2,
        0,
        logicalWidth / 2,
        logicalHeight / 2,
        Math.sqrt(logicalWidth ** 2 + logicalHeight ** 2) / 2,
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);
    };

    const updateCellOpacities = () => {
      const targets = new Map<string, number>();

      if (hoveredSquare.current) {
        targets.set(
          `${hoveredSquare.current.x},${hoveredSquare.current.y}`,
          1,
        );
      }

      if (hoverTrailAmount > 0) {
        for (let i = 0; i < trailCells.current.length; i++) {
          const t = trailCells.current[i];
          const key = `${t.x},${t.y}`;
          if (!targets.has(key)) {
            targets.set(
              key,
              (trailCells.current.length - i) /
                (trailCells.current.length + 1),
            );
          }
        }
      }

      for (const key of targets.keys()) {
        if (!cellOpacities.current.has(key)) {
          cellOpacities.current.set(key, 0);
        }
      }

      for (const [key, opacity] of cellOpacities.current) {
        const target = targets.get(key) ?? 0;
        const next = opacity + (target - opacity) * 0.35;
        if (next < 0.005) {
          cellOpacities.current.delete(key);
        } else {
          cellOpacities.current.set(key, next);
        }
      }
    };

    const updateAnimation = () => {
      if (!reducedMotion && active) {
        const effectiveSpeed = Math.max(speed, 0.1);
        const wrapX = isHex ? hexHoriz * 2 : squareSize;
        const wrapY = isHex ? hexVert : isTri ? squareSize * 2 : squareSize;

        switch (direction) {
          case "right":
            gridOffset.current.x =
              (gridOffset.current.x - effectiveSpeed + wrapX) % wrapX;
            break;
          case "left":
            gridOffset.current.x =
              (gridOffset.current.x + effectiveSpeed + wrapX) % wrapX;
            break;
          case "up":
            gridOffset.current.y =
              (gridOffset.current.y + effectiveSpeed + wrapY) % wrapY;
            break;
          case "down":
            gridOffset.current.y =
              (gridOffset.current.y - effectiveSpeed + wrapY) % wrapY;
            break;
          case "diagonal":
            gridOffset.current.x =
              (gridOffset.current.x - effectiveSpeed + wrapX) % wrapX;
            gridOffset.current.y =
              (gridOffset.current.y - effectiveSpeed + wrapY) % wrapY;
            break;
          default:
            break;
        }
      }

      updateCellOpacities();
      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const pushTrail = () => {
      if (hoveredSquare.current && hoverTrailAmount > 0) {
        trailCells.current.unshift({ ...hoveredSquare.current });
        if (trailCells.current.length > hoverTrailAmount) {
          trailCells.current.length = hoverTrailAmount;
        }
      }
    };

    const updateHoveredCell = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      if (isHex) {
        const colShift = Math.floor(gridOffset.current.x / hexHoriz);
        const offsetX =
          ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz;
        const offsetY =
          ((gridOffset.current.y % hexVert) + hexVert) % hexVert;
        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.round(adjustedX / hexHoriz);
        const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
        const row = Math.round((adjustedY - rowOffset) / hexVert);

        if (
          !hoveredSquare.current ||
          hoveredSquare.current.x !== col ||
          hoveredSquare.current.y !== row
        ) {
          pushTrail();
          hoveredSquare.current = { x: col, y: row };
        }
      } else if (isTri) {
        const halfW = squareSize / 2;
        const offsetX =
          ((gridOffset.current.x % halfW) + halfW) % halfW;
        const offsetY =
          ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.round(adjustedX / halfW);
        const row = Math.floor(adjustedY / squareSize);

        if (
          !hoveredSquare.current ||
          hoveredSquare.current.x !== col ||
          hoveredSquare.current.y !== row
        ) {
          pushTrail();
          hoveredSquare.current = { x: col, y: row };
        }
      } else if (shape === "circle") {
        const offsetX =
          ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
        const offsetY =
          ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.round(adjustedX / squareSize);
        const row = Math.round(adjustedY / squareSize);

        if (
          !hoveredSquare.current ||
          hoveredSquare.current.x !== col ||
          hoveredSquare.current.y !== row
        ) {
          pushTrail();
          hoveredSquare.current = { x: col, y: row };
        }
      } else {
        const offsetX =
          ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
        const offsetY =
          ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.floor(adjustedX / squareSize);
        const row = Math.floor(adjustedY / squareSize);

        if (
          !hoveredSquare.current ||
          hoveredSquare.current.x !== col ||
          hoveredSquare.current.y !== row
        ) {
          pushTrail();
          hoveredSquare.current = { x: col, y: row };
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      updateHoveredCell(event.clientX, event.clientY);
    };

    const handlePointerLeave = () => {
      pushTrail();
      hoveredSquare.current = null;
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointercancel", handlePointerLeave);
    canvas.addEventListener("pointerdown", handlePointerMove);

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointercancel", handlePointerLeave);
      canvas.removeEventListener("pointerdown", handlePointerMove);
    };
  }, [
    active,
    reducedMotion,
    direction,
    speed,
    borderColor,
    hoverFillColor,
    hoverColor,
    squareSize,
    shape,
    hoverTrailAmount,
  ]);

  return (
    <div ref={wrapperRef} className={cn("absolute inset-0", className)}>
      <canvas ref={canvasRef} className="shapegrid-canvas" />
    </div>
  );
}
