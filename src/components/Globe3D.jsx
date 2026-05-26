"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const lonLatToVector3 = (lon, lat, radius = 1.02) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

export default function Globe3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth || 560;
    const H = el.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);
    camera.position.z = 3.15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/assets/earth-blue-marble.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const earthGeo = new THREE.SphereGeometry(1, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 14,
      specular: new THREE.Color(0x1a8bd6),
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.rotation.y = -0.7;
    earthGroup.add(earth);

    const wireGeo = new THREE.SphereGeometry(1.024, 42, 42);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.055,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    earthGroup.add(wireSphere);

    const atmosphereGeo = new THREE.SphereGeometry(1.1, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

    scene.add(new THREE.AmbientLight(0x8fb8ff, 1.15));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(4, 2, 3);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x8b5cf6, 1.2);
    rim.position.set(-3, -1, -2);
    scene.add(rim);

    const cities = [
      [77.2, 28.6], [72.9, 19.1], [88.4, 22.6], [77.6, 12.9], [78.5, 17.4],
      [-74, 40.7], [-0.1, 51.5], [2.3, 48.8], [139.7, 35.7], [103.8, 1.3],
      [151.2, -33.9], [31.2, 30], [55.3, 25.2], [-46.6, -23.5],
    ];

    const nodeGroup = new THREE.Group();
    const nodeMeshes = cities.map(([lon, lat], i) => {
      const geo = new THREE.SphereGeometry(i < 5 ? 0.019 : 0.014, 10, 10);
      const mat = new THREE.MeshBasicMaterial({
        color: i < 5 ? 0xf0abfc : 0xa78bfa,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(lonLatToVector3(lon, lat, 1.045));
      nodeGroup.add(mesh);
      return mesh;
    });
    earthGroup.add(nodeGroup);

    const edgeGroup = new THREE.Group();
    cities.slice(0, 5).forEach(([lonA, latA]) => {
      cities.slice(5).forEach(([lonB, latB], index) => {
        if (index % 2 !== 0) return;
        const geo = new THREE.BufferGeometry().setFromPoints([
          lonLatToVector3(lonA, latA, 1.055),
          lonLatToVector3(lonB, latB, 1.055),
        ]);
        const mat = new THREE.LineBasicMaterial({
          color: 0xc4b5fd,
          transparent: true,
          opacity: 0.15,
        });
        edgeGroup.add(new THREE.Line(geo, mat));
      });
    });
    earthGroup.add(edgeGroup);

    const ringGeo = new THREE.TorusGeometry(1.22, 0.004, 8, 140);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.28,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.45;
    scene.add(ring);

    const pCount = 180;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i += 1) {
      const r = 1.18 + Math.random() * 0.55;
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xbfdbfe,
      size: 0.012,
      transparent: true,
      opacity: 0.58,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let mx = 0;
    let my = 0;
    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      my = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = Date.now() * 0.001;

      earthGroup.rotation.y = t * 0.08 + mx * 0.18;
      earthGroup.rotation.x = my * 0.12;
      wireSphere.rotation.y = t * 0.04;
      ring.rotation.z = t * 0.16;
      particles.rotation.y = -t * 0.035;

      nodeMeshes.forEach((mesh, index) => {
        mesh.material.opacity = 0.6 + Math.sin(t * 1.4 + index) * 0.25;
      });

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const w = el.clientWidth || W;
      const h = el.clientHeight || H;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      earthTexture.dispose();
      scene.traverse((object) => {
        if (!object.isMesh && !object.isLine && !object.isPoints) return;
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material?.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
