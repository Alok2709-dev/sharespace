'use client';

import React, { useRef, useState } from 'react';

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
  tiltMaxAngle = 7,
  perspective = 1000,
  scaleOnHover = 1.02
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = x / rect.width;
    const percentY = y / rect.height;

    const rotX = (0.5 - percentY) * (tiltMaxAngle * 2);
    const rotY = (percentX - 0.5) * (tiltMaxAngle * 2);

    setRotation({ x: rotX, y: rotY });
    setGlarePosition({
      x: percentX * 100,
      y: percentY * 100,
      opacity: 0.12
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out preserve-3d ${className}`}
      style={{
        perspective: `${perspective}px`,
        transform: isHovered
          ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, ${scaleOnHover})`
          : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      }}
    >
      {children}

      {/* Dynamic Specular Sheen Glare */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.55), rgba(255, 215, 106, 0.15), transparent 75%)`,
          borderRadius: 'inherit'
        }}
      />
    </div>
  );
}
