'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';

export function HeroVisual3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [telemetryState, setTelemetryState] = useState({
    fps: 60,
    activeNodes: 12,
    allocationMode: 'FIFO STRICT',
    integrity: '99.98%'
  });

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Detect WebGL support
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn('WebGL not supported, using fallback', e);
      return;
    }

    const width = currentMount.clientWidth || 540;
    const height = currentMount.clientHeight || 460;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    currentMount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xC7FF55, 3, 20);
    pointLight1.position.set(4, 5, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x38BDF8, 2, 20);
    pointLight2.position.set(-4, -4, 3);
    scene.add(pointLight2);

    // Group for mouse rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Core Icosahedron Wireframe with Glowing Edges
    const geometryIco = new THREE.IcosahedronGeometry(2.0, 1);
    const wireframeIco = new THREE.WireframeGeometry(geometryIco);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xC7FF55,
      transparent: true,
      opacity: 0.75,
      linewidth: 1
    });
    const icosahedronLines = new THREE.LineSegments(wireframeIco, lineMaterial);
    rootGroup.add(icosahedronLines);

    // 2. Translucent Inner Crystalline Core
    const innerGeom = new THREE.OctahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x131D16,
      emissive: 0x1B3520,
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.6,
      ior: 1.5,
      transparent: true,
      opacity: 0.85
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    rootGroup.add(innerCore);

    // 3. Floating Orbital Rings (Gimbal)
    const ringGeom = new THREE.TorusGeometry(2.6, 0.025, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xC7FF55,
      transparent: true,
      opacity: 0.5
    });
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.35
    });

    const ring1 = new THREE.Mesh(ringGeom, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    rootGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeom, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.scale.set(1.15, 1.15, 1.15);
    rootGroup.add(ring2);

    // 4. Ambient Floating Node Particles
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorLime = new THREE.Color(0xC7FF55);
    const colorWhite = new THREE.Color(0xF4F5EF);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = Math.random() > 0.4 ? colorLime : colorWhite;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    rootGroup.add(particles);

    // Mouse Tracking with Spring Damping
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = mouseX * 0.8;
      targetRotationX = -mouseY * 0.8;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = currentMount.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = x * 0.8;
        targetRotationX = -y * 0.8;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      if (newW && newH) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia rotation towards mouse target
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.05;

      // Continuous autonomous idle orbital spins
      icosahedronLines.rotation.y = elapsedTime * 0.15;
      icosahedronLines.rotation.z = elapsedTime * 0.08;

      innerCore.rotation.x = -elapsedTime * 0.3;
      innerCore.rotation.y = elapsedTime * 0.25;

      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.x = -elapsedTime * 0.25;

      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('touchmove', handleTouchMove);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      className="relative w-full h-[420px] sm:h-[480px] lg:h-[520px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Mounting Node */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Floating HUD Telemetry Badges - Architectural Aesthetic */}
      <div className="absolute top-4 left-4 z-10 glass-panel px-3.5 py-2.5 rounded-lg border border-[#27332C] flex items-center gap-2.5 shadow-xl pointer-events-none">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7FF55] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C7FF55]" />
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">Ledger Protocol</span>
          <span className="text-xs font-mono font-bold text-[#F4F5EF] flex items-center gap-1">
            <span>LIVE SYNC</span>
            <span className="text-[#C7FF55]">• 4ms</span>
          </span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 glass-panel px-3.5 py-2.5 rounded-lg border border-[#27332C] flex items-center gap-2.5 shadow-xl pointer-events-none">
        <Cpu className="w-4 h-4 text-[#C7FF55]" />
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">Inventory Node</span>
          <span className="text-xs font-mono font-bold text-[#F4F5EF]">12 VERIFIED ASSETS</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-10 glass-panel px-4 py-3 rounded-xl border border-[#27332C] max-w-sm backdrop-blur-md shadow-2xl pointer-events-none">
        <div className="flex items-center justify-between pb-2 border-b border-[#212824] mb-2 text-[10px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 text-[#C7FF55]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FIFO ALLOCATION ENGINE</span>
          </div>
          <span className="text-zinc-500">TAMPER-PROOF</span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-snug font-sans">
          Physical handovers verified via bilateral cryptographic checklist. Zero single-point trust.
        </p>
      </div>

      {/* Decorative Radial Background Accent Glow */}
      <div className="absolute inset-0 bg-radial from-[#C7FF55]/10 via-transparent to-transparent opacity-60 pointer-events-none blur-3xl -z-10" />
    </div>
  );
}
