'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngle?: number;
  perspective?: number;
  scaleOnHover?: number;
  href?: string;
}

export function TiltCard({
  children,
  className = '',
  tiltMaxAngle = 6,
  perspective = 1000,
  scaleOnHover = 1.02,
  href
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const isDragging = useRef(false);
  const mouseDownPos = useRef({ x: 0, y: 0 });
  const router = useRouter();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = false;
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Detect drag vs click — if mouse moved more than 5px it's a drag
    const dx = e.clientX - mouseDownPos.current.x;
    const dy = e.clientY - mouseDownPos.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 5) {
      isDragging.current = true;
    }

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
    isDragging.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If href is provided on TiltCard itself, navigate on clean click
    if (href && !isDragging.current) {
      router.push(href);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
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
