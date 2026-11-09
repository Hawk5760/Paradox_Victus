import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  sceneType?: 'campus' | 'classroom' | 'lab' | 'celebration';
  className?: string;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ sceneType = 'campus', className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneTypeRef = useRef(sceneType);
  sceneTypeRef.current = sceneType;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3d1, 1.5);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x65c7f2, 1, 10);
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    // Cartoon Props Group
    const propsGroup = new THREE.Group();
    scene.add(propsGroup);

    // 1. Floating Paper Plane
    const planeGeo = new THREE.ConeGeometry(0.35, 0.9, 3);
    const planeMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      wireframe: false,
    });
    const paperPlane = new THREE.Mesh(planeGeo, planeMat);
    paperPlane.rotation.x = Math.PI / 2;
    paperPlane.rotation.z = Math.PI / 4;
    paperPlane.position.set(1.4, 0.6, 0);
    propsGroup.add(paperPlane);

    // 2. Cartoon Notebook / Attendance Register
    const bookGeo = new THREE.BoxGeometry(0.7, 0.9, 0.12);
    const bookMat = new THREE.MeshToonMaterial({ color: 0xff963c });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(-1.4, 0.2, -0.5);
    book.rotation.set(0.2, 0.4, -0.15);
    propsGroup.add(book);

    // Pages inside notebook
    const pagesGeo = new THREE.BoxGeometry(0.65, 0.85, 0.08);
    const pagesMat = new THREE.MeshToonMaterial({ color: 0xfff7e8 });
    const pages = new THREE.Mesh(pagesGeo, pagesMat);
    pages.position.set(0.02, 0, 0);
    book.add(pages);

    // 3. Cartoon Pencil / Chalk
    const pencilGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6);
    const pencilMat = new THREE.MeshToonMaterial({ color: 0xffd43b });
    const pencil = new THREE.Mesh(pencilGeo, pencilMat);
    pencil.position.set(-1.1, 0.7, -0.3);
    pencil.rotation.set(0.5, 0.2, 0.8);
    propsGroup.add(pencil);

    // 4. Cheerful Floating Star / Badge
    const starGeo = new THREE.OctahedronGeometry(0.25, 0);
    const starMat = new THREE.MeshToonMaterial({ color: 0xffd43b, emissive: 0xff963c, emissiveIntensity: 0.2 });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.set(0, 1.2, -0.8);
    propsGroup.add(star);

    // 5. Floating Dust / Sparks particles
    const particleCount = 20;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5;
      positions[i + 1] = (Math.random() - 0.5) * 3;
      positions[i + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd43b,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const elapsed = clock.getElapsedTime();

      // Gentle bobbing and floating
      paperPlane.position.y = 0.6 + Math.sin(elapsed * 2) * 0.15;
      paperPlane.position.x = 1.4 + Math.cos(elapsed * 1.5) * 0.1;
      paperPlane.rotation.z = Math.PI / 4 + Math.sin(elapsed * 2.5) * 0.15;

      book.rotation.y = 0.4 + Math.sin(elapsed * 1.2) * 0.1;
      book.position.y = 0.2 + Math.cos(elapsed * 1.2) * 0.08;

      pencil.rotation.z = 0.8 + Math.cos(elapsed * 2) * 0.2;

      star.rotation.y = elapsed * 1.5;
      star.rotation.x = elapsed * 0.8;
      star.position.y = 1.2 + Math.sin(elapsed * 2.5) * 0.1;

      particles.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      bookGeo.dispose();
      bookMat.dispose();
      pencilGeo.dispose();
      pencilMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full pointer-events-none ${className}`} />;
};
