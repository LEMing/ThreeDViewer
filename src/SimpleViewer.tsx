import React, {useEffect, useRef} from 'react';

import * as THREE from 'three';


import {cleanupScene} from './ThreeSceneSetup/cleanupScene';
import {setupScene} from './ThreeSceneSetup/setupScene';
import {updateSize} from './ThreeSceneSetup/updateSize';
import {throttle} from './utils';

interface SimpleViewerProps {
  object: THREE.Object3D | null; // Pass any Three.js object
}

const SimpleViewer: React.FC<SimpleViewerProps> = ({object}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const resize = () => updateSize(
      rendererRef.current as THREE.WebGLRenderer,
      cameraRef.current as THREE.PerspectiveCamera,
      mountRef,
      sceneRef.current as THREE.Scene
    );
    const resizeHandler = throttle(resize, 50);

    const { renderer } = setupScene({ mountRef, rendererRef, cameraRef, sceneRef }, object);

    resize(); // Initial size update

    window.addEventListener('resize', resizeHandler);

    return () => cleanupScene(mountRef, renderer, resizeHandler);
  }, [object]);

  return <div style={{ width: '100%', height: '100%'}} ref={mountRef} />;
};

export default SimpleViewer;
