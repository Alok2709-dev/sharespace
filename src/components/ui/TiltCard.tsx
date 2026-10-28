'use client';

import React, { useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngle?: number;
  perspective?: number;
  scaleOnHover?: number;
}

export function TiltCard({
  children,
  className = '',
  tiltMaxAngle = 6,
  perspective = 1000,
  scaleOnHover = 1.02
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = x / rect.width;
    const percentY = y / rect.height;

    const rotX = (0.5 - percentY) * (tiltMaxAngle * 2);
    const rotY = (percentX - 0.5) * (tiltMaxAngle * 2);

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, ${scaleOnHover})`;
      }
      if (glareRef.current) {
        glareRef.current.style.opacity = '0.18';
        glareRef.current.style.background = `radial-gradient(circle 320px at ${(percentX * 100).toFixed(1)}% ${(percentY * 100).toFixed(1)}%, rgba(255, 255, 255, 0.7), rgba(255, 215, 106, 0.2), transparent 75%)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform cursor-pointer ${className}`}
      style={{
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
      }}
    >
      {children}

      {/* Dynamic Specular Sheen Glare */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-[inherit] opacity-0"
      />
    </div>
  );
}
