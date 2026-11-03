"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090d16, 0.035);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 10.5);

    // 2. Renderer setup with high-performance WebGL
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    // 3. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x818cf8, 2.5); // Indigo key light
    keyLight.position.set(6, 7, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x22d3ee, 2.0); // Cyan rim light
    rimLight.position.set(-7, -4, 5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xc084fc, 2.2, 25); // Violet accent
    fillLight.position.set(0, 3, 5);
    scene.add(fillLight);

    // 4. Interactive container group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 5. High-resolution canvas texture generator for realistic PDF pages
    function createDocumentTexture(
      title: string,
      subtitle: string,
      tagColor: string,
      tagText: string,
      isHighlighted: boolean
    ) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Card Background with subtle gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1400);
      bgGrad.addColorStop(0, "#141824");
      bgGrad.addColorStop(1, "#0d111a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1400);

      // Perimeter border
      ctx.strokeStyle = isHighlighted ? "#818cf8" : "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = isHighlighted ? 12 : 6;
      ctx.strokeRect(10, 10, 1004, 1380);

      // Top red/indigo PDF tag
      ctx.fillStyle = tagColor;
      ctx.beginPath();
      ctx.roundRect(60, 70, 120, 48, 10);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(tagText, 95, 103);

      // Document Title
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(title, 205, 107);

      // Subtitle / Page metadata
      ctx.fillStyle = "#94a3b8";
      ctx.font = "26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(subtitle, 65, 175);

      // Horizontal separator rule
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(65, 215);
      ctx.lineTo(959, 215);
      ctx.stroke();

      // Simulated realistic paragraphs & chart data
      const lineCount = 13;
      for (let i = 0; i < lineCount; i++) {
        const y = 275 + i * 58;

        if (isHighlighted && (i === 3 || i === 4)) {
          // Luminous AI citation highlight zone
          ctx.fillStyle = "rgba(129, 140, 248, 0.28)";
          ctx.beginPath();
          ctx.roundRect(65, y - 20, 894, 52, 10);
          ctx.fill();

          ctx.strokeStyle = "rgba(129, 140, 248, 0.8)";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#e0e7ff";
          ctx.fillRect(80, y, 820, 16);
        } else {
          ctx.fillStyle = i % 4 === 0 ? "rgba(148, 163, 184, 0.6)" : "rgba(71, 85, 105, 0.45)";
          const lineWidth = i === lineCount - 1 || i % 5 === 0 ? 520 : 894 - (i % 3) * 70;
          ctx.beginPath();
          ctx.roundRect(65, y, lineWidth, 14, 6);
          ctx.fill();
        }
      }

      // Simulated mini data chart block inside PDF
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.beginPath();
      ctx.roundRect(65, 1070, 894, 240, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.stroke();

      // Mini chart bars
      const barHeights = [60, 95, 140, 180, 210];
      const barColors = ["#475569", "#64748b", "#818cf8", "#c084fc", "#22d3ee"];
      barHeights.forEach((h, bIdx) => {
        ctx.fillStyle = barColors[bIdx];
        ctx.beginPath();
        ctx.roundRect(160 + bIdx * 140, 1270 - h, 70, h, [8, 8, 0, 0]);
        ctx.fill();
      });

      // Interactive citation status badge
      if (isHighlighted) {
        ctx.fillStyle = "#6366f1";
        ctx.beginPath();
        ctx.roundRect(65, 1335, 460, 48, 12);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("✨ AI Semantic Citation Linked", 100, 1370);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 8;
      return texture;
    }

    // 6. Layered floating 3D document pages
    const docs = [
      {
        title: "SEC_10-K_FY2024.pdf",
        sub: "168 pages • Consolidated Operations",
        tagColor: "#ef4444",
        tagText: "SEC",
        pos: [1.3, 0.1, 0.7] as [number, number, number],
        rot: [-0.08, -0.28, 0.04] as [number, number, number],
        highlight: true,
      },
      {
        title: "Contract_Enterprise_v4.pdf",
        sub: "128 pages • Risk & Compliance Analysis",
        tagColor: "#8b5cf6",
        tagText: "LEGAL",
        pos: [-1.5, -0.35, -0.5] as [number, number, number],
        rot: [0.12, 0.22, -0.06] as [number, number, number],
        highlight: false,
      },
      {
        title: "Transformer_Attention.pdf",
        sub: "32 pages • Attention Architecture",
        tagColor: "#06b6d4",
        tagText: "ARXIV",
        pos: [0.15, -1.3, -1.2] as [number, number, number],
        rot: [0.2, 0.05, 0.08] as [number, number, number],
        highlight: false,
      },
    ];

    const docMeshes: THREE.Mesh[] = [];
    const geom = new THREE.BoxGeometry(3.6, 4.9, 0.06);

    docs.forEach((cfg) => {
      const frontTexture = createDocumentTexture(
        cfg.title,
        cfg.sub,
        cfg.tagColor,
        cfg.tagText,
        cfg.highlight
      );
      const sideMat = new THREE.MeshPhongMaterial({ color: 0x141824, shininess: 40 });
      const frontMat = new THREE.MeshPhongMaterial({
        map: frontTexture,
        shininess: 45,
        specular: 0x6366f1,
      });

      const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, sideMat];
      const mesh = new THREE.Mesh(geom, materials);
      mesh.position.set(...cfg.pos);
      mesh.rotation.set(...cfg.rot);

      mesh.userData = {
        basePos: new THREE.Vector3(...cfg.pos),
        baseRot: new THREE.Vector3(...cfg.rot),
        speed: 1.0 + Math.random() * 0.4,
      };

      mainGroup.add(mesh);
      docMeshes.push(mesh);
    });

    // 7. Floating Holographic AI Chat Bubble in 3D Space (1024x512 resolution)
    const chatCanvas = document.createElement("canvas");
    chatCanvas.width = 1024;
    chatCanvas.height = 512;
    const cctx = chatCanvas.getContext("2d");
    if (cctx) {
      // Glass background
      cctx.fillStyle = "rgba(15, 23, 42, 0.94)";
      cctx.beginPath();
      cctx.roundRect(16, 16, 992, 480, 40);
      cctx.fill();

      // Glowing indigo border
      cctx.strokeStyle = "#818cf8";
      cctx.lineWidth = 8;
      cctx.stroke();

      // AI Icon Circle
      cctx.fillStyle = "#6366f1";
      cctx.beginPath();
      cctx.arc(100, 110, 48, 0, Math.PI * 2);
      cctx.fill();

      cctx.fillStyle = "#ffffff";
      cctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      cctx.fillText("AI", 80, 124);

      // Title & Live Citation Pill
      cctx.fillStyle = "#f8fafc";
      cctx.font = "bold 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      cctx.fillText("Neural Synthesizer", 175, 102);

      cctx.fillStyle = "#22d3ee";
      cctx.font = "26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      cctx.fillText("⚡ Verified citation linked to Page 14 § 4.2", 175, 145);

      // Quotation body
      cctx.fillStyle = "#e2e8f0";
      cctx.font = "32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      cctx.fillText('"Net cloud operating margin grew to 73.8%,', 70, 255);
      cctx.fillText('beating management guidance of 70-71.5%."', 70, 315);

      // Footer latency tag
      cctx.fillStyle = "rgba(34, 211, 238, 0.15)";
      cctx.beginPath();
      cctx.roundRect(70, 395, 380, 52, 12);
      cctx.fill();

      cctx.fillStyle = "#22d3ee";
      cctx.font = "bold 24px monospace";
      cctx.fillText("Traversed 168 pages in 0.38s", 95, 430);

      // Status Green Dot
      cctx.fillStyle = "#10b981";
      cctx.beginPath();
      cctx.arc(940, 95, 12, 0, Math.PI * 2);
      cctx.fill();
    }

    const chatTexture = new THREE.CanvasTexture(chatCanvas);
    chatTexture.anisotropy = 8;

    const chatGeom = new THREE.PlaneGeometry(3.7, 1.85);
    const chatMat = new THREE.MeshBasicMaterial({
      map: chatTexture,
      transparent: true,
      opacity: 0.98,
      side: THREE.DoubleSide,
    });
    const chatBubble = new THREE.Mesh(chatGeom, chatMat);
    chatBubble.position.set(2.4, -1.15, 1.8);
    chatBubble.rotation.set(-0.04, -0.28, 0);
    mainGroup.add(chatBubble);

    // 8. Floating interactive particles / semantic data nodes
    const particleCount = 160;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0x818cf8),
      new THREE.Color(0x22d3ee),
      new THREE.Color(0xc084fc),
      new THREE.Color(0x38bdf8),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // 9. Interactive Parallax & Drag Dynamics
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      targetX = (x - 0.5) * 1.6;
      targetY = (y - 0.5) * 1.2;
    };

    const onPointerMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      setIsInteracting(false);
    };

    const onPointerDown = () => {
      setIsInteracting(true);
    };

    const onPointerUp = () => {
      setIsInteracting(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerLeave);

    // 10. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia damping
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      mainGroup.rotation.y = mouseX * 0.45;
      mainGroup.rotation.x = -mouseY * 0.35;

      // Gentle floating buoyancy for each document
      docMeshes.forEach((mesh, idx) => {
        const s = mesh.userData.speed;
        mesh.position.y =
          mesh.userData.basePos.y + Math.sin(elapsedTime * 1.1 * s + idx * 1.5) * 0.12;
        mesh.rotation.z = mesh.userData.baseRot.z + Math.cos(elapsedTime * 0.8 * s) * 0.025;
      });

      // Chat bubble floating rhythm
      chatBubble.position.y = -1.15 + Math.sin(elapsedTime * 1.4 + 1.2) * 0.1;
      chatBubble.rotation.y = -0.28 + Math.cos(elapsedTime * 0.7) * 0.035;

      // Constellation node rotation
      particleSystem.rotation.y = elapsedTime * 0.035;
      particleSystem.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };
    animate();

    // 11. Responsive resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
      geom.dispose();
      chatGeom.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      chatMat.dispose();
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] rounded-2xl bg-gradient-to-b from-[#0d121f] to-[#090d16] shadow-2xl overflow-hidden group select-none">
      {/* Interactive Canvas Mount Point */}
      <div
        ref={containerRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-300 ${
          isInteracting ? "cursor-grabbing" : "cursor-grab"
        }`}
      />

      {/* Floating 3D Interaction Cue */}
      <div className="absolute top-4 right-4 pointer-events-none z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span className="font-label-code text-[11px] text-cyan-300 uppercase tracking-wider">
          Interactive 3D Stage • Drag / Tilt
        </span>
      </div>

      {/* Radial Depth Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(9,13,22,0.85)_100%)]"></div>
    </div>
  );
}
