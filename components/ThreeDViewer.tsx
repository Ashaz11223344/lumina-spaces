
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Box, MousePointer2, Layers } from 'lucide-react';

interface ThreeDViewerProps {
  imageUrl: string;
  depthUrl: string;
  onClose: () => void;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ imageUrl, depthUrl, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0F120E');
    
    // Add subtle fog to blend the edges into the void
    scene.fog = new THREE.FogExp2('#0F120E', 0.15);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1.8; // Move back slightly to see more context

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance on high-res screens
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // 4. Load Textures
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    Promise.all([
        new Promise<THREE.Texture>((resolve, reject) => textureLoader.load(imageUrl, resolve, undefined, reject)),
        new Promise<THREE.Texture>((resolve, reject) => textureLoader.load(depthUrl, resolve, undefined, reject))
    ]).then(([imgTexture, depthTexture]) => {
        setLoading(false);

        // Texture settings for better quality
        imgTexture.minFilter = THREE.LinearFilter;
        imgTexture.magFilter = THREE.LinearFilter;
        imgTexture.colorSpace = THREE.SRGBColorSpace;

        // 5. Create Geometry
        const sourceImage = imgTexture.image as HTMLImageElement;
        const aspect = sourceImage.width / sourceImage.height;
        const geometry = new THREE.PlaneGeometry(2.5 * aspect, 2.5, 768, 768);

        // 6. Detailed Material
        const material = new THREE.MeshStandardMaterial({
            map: imgTexture,
            displacementMap: depthTexture,
            displacementScale: 1.2, 
            displacementBias: -0.4, 
            side: THREE.DoubleSide,
            roughness: 0.6,
            metalness: 0.2,
            flatShading: false,
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.castShadow = true;
        plane.receiveShadow = true;
        scene.add(plane);

        // 7. Lighting Setup 
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        // Key Light (Warm)
        const dirLight = new THREE.DirectionalLight(0xffddaa, 1.5);
        dirLight.position.set(3, 3, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        // Rim Light (Cool)
        const rimLight = new THREE.DirectionalLight(0xccddff, 1.0);
        rimLight.position.set(-3, 3, 2);
        scene.add(rimLight);

        // Dynamic Moving Light (Earthy Secondary Accent)
        const movingLight = new THREE.PointLight(0xAAC48C, 2, 10);
        scene.add(movingLight);

        // 8. Interaction 
        const cursor = { x: 0, y: 0 };
        const targetRotation = { x: 0, y: 0 };

        const onMouseMove = (e: MouseEvent) => {
            cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
            cursor.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // 9. Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            targetRotation.x = cursor.y * 0.4; 
            targetRotation.y = cursor.x * 0.4; 
            
            plane.rotation.x += (targetRotation.x - plane.rotation.x) * 0.05;
            plane.rotation.y += (targetRotation.y - plane.rotation.y) * 0.05;

            movingLight.position.x = Math.sin(time * 0.5) * 4;
            movingLight.position.y = Math.cos(time * 0.3) * 3;
            movingLight.position.z = 2 + Math.sin(time * 0.8);

            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        const onResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            imgTexture.dispose();
            depthTexture.dispose();
        };
    }).catch(err => {
        console.error("3D Texture Load Error", err);
        setLoading(false);
    });
  }, [imageUrl, depthUrl]);

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <div ref={containerRef} className="w-full h-full cursor-move" />
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none">
          <div className="bg-background/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 pointer-events-auto shadow-2xl">
              <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                  <Box className="text-secondary animate-pulse" />
                  Holographic View
              </h3>
              <div className="space-y-1 mt-2">
                <p className="text-sm text-accent/80 flex items-center gap-2">
                    <MousePointer2 size={14} className="text-tertiary" />
                    Move cursor to rotate perspective
                </p>
                <p className="text-xs text-accent/40 flex items-center gap-2">
                    <Layers size={12} />
                    Organic Geometry Active
                </p>
              </div>
          </div>
          
          <button 
            onClick={onClose}
            className="group p-4 bg-white/5 hover:bg-red-500/20 rounded-full text-white transition-all pointer-events-auto border border-white/10 hover:border-red-500/50 hover:rotate-90 duration-300"
          >
              <X size={24} className="group-hover:text-red-400" />
          </button>
      </div>

      {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-background/80 backdrop-blur-sm z-50">
              <div className="relative">
                  <div className="w-16 h-16 border-4 border-white/10 border-t-secondary rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Box size={20} className="text-white/50" />
                  </div>
              </div>
              <span className="mt-6 text-white font-display font-bold tracking-widest uppercase text-sm animate-pulse">
                  Assembling Space...
              </span>
          </div>
      )}
    </div>
  );
};

export default ThreeDViewer;
