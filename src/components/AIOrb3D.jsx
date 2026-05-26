"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AIOrb3D({
  speaking = false,
  active = true,
  size = 120,
  className = "",
}) {
  const mountRef = useRef(null);
  const speakRef = useRef(speaking);
  const activeRef = useRef(active);

  useEffect(() => {
    speakRef.current = speaking;
  }, [speaking]);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const S = size;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 2.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(S, S);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* ── Core sphere ─────────────────────────────── */
    const coreGeo = new THREE.SphereGeometry(0.56, 64, 64);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      emissive: new THREE.Color(0x3b0ea8),
      emissiveIntensity: 0.6,
      shininess: 120,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    /* ── Inner glow ───────────────────────────────── */
    const glowGeo = new THREE.SphereGeometry(0.58, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    /* ── Wireframe shell ──────────────────────────── */
    const wireGeo = new THREE.SphereGeometry(0.68, 18, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    /* ── Orbiting ring ────────────────────────────── */
    const ringGeo = new THREE.TorusGeometry(0.78, 0.006, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    /* ── Second ring ──────────────────────────────── */
    const ring2Geo = new THREE.TorusGeometry(0.88, 0.004, 8, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.18,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 5;
    ring2.rotation.z = Math.PI / 4;
    scene.add(ring2);

    /* ── Orbiting nodes ───────────────────────────── */
    const orbitNodes = Array.from({ length: 6 }, (_, i) => {
      const g = new THREE.SphereGeometry(0.038, 8, 8);
      const m = new THREE.MeshBasicMaterial({
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(g, m);
      scene.add(mesh);
      return { mesh, phase: (i / 6) * Math.PI * 2 };
    });

    /* ── Particles ────────────────────────────────── */
    const pN = 120;
    const pPos = new Float32Array(pN * 3);
    const pPhase = new Float32Array(pN);
    for (let i = 0; i < pN; i++) {
      const r = 0.72 + Math.random() * 0.5;
      const p = Math.random() * Math.PI;
      const t = Math.random() * Math.PI * 2;
      pPos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pPos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pPos[i * 3 + 2] = r * Math.cos(p);
      pPhase[i] = Math.random() * Math.PI * 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.018,
      transparent: true,
      opacity: 0.5,
    });
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    /* ── Lights ───────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const ptLight = new THREE.PointLight(0x818cf8, 2.5, 5);
    ptLight.position.set(1, 1, 2);
    scene.add(ptLight);
    const ptLight2 = new THREE.PointLight(0xa855f7, 1.5, 5);
    ptLight2.position.set(-1, -1, 1);
    scene.add(ptLight2);

    /* ── Animate ──────────────────────────────────── */
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = Date.now() * 0.001;
      const speak = speakRef.current;
      const isActive = activeRef.current;
      const pulse = speak ? 1 + Math.sin(t * 8) * 0.08 : 1;

      core.scale.setScalar(pulse);
      core.rotation.y = t * 0.4;
      core.rotation.z = t * 0.15;
      coreMat.emissiveIntensity = isActive
        ? speak
          ? 0.8 + Math.sin(t * 6) * 0.4
          : 0.5
        : 0.15;

      wire.rotation.y = -t * 0.25;
      wire.rotation.x = t * 0.1;
      wireMat.opacity = isActive ? 0.12 + Math.sin(t * 2) * 0.06 : 0.04;

      ring.rotation.y = t * 0.6;
      ring2.rotation.x = Math.PI / 5 + t * 0.45;

      orbitNodes.forEach(({ mesh, phase }, i) => {
        const a = t * 0.8 + phase;
        const r = 0.82;
        mesh.position.set(
          Math.cos(a) * r,
          Math.sin(a * 0.5) * 0.3,
          Math.sin(a) * r,
        );
        mesh.material.opacity = isActive
          ? 0.7 + Math.sin(t * 2 + i) * 0.3
          : 0.2;
      });

      pts.rotation.y = t * 0.05;
      pMat.opacity = isActive ? (speak ? 0.7 : 0.45) : 0.15;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (renderer.domElement.parentNode === el)
        el.removeChild(renderer.domElement);
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
