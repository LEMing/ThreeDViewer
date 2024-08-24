import React, {useEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { cleanupScene } from './ThreeSceneSetup/cleanupScene';
import { setupScene } from './ThreeSceneSetup/setupScene';
import { updateSize } from './ThreeSceneSetup/updateSize';
import { SimpleViewerProps, SimpleViewerOptions } from './types';
import { throttle } from './utils';
import defaultOptions from './defaultOptions'; // Import the default options

const SimpleViewer: React.FC<SimpleViewerProps> = ({ object, options = defaultOptions }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const mergedOptions = useMemo<SimpleViewerOptions>(() => ({
    ...defaultOptions,
    ...options,
    camera: { ...defaultOptions.camera, ...options.camera },
    lightning: { ...defaultOptions.lightning, ...options.lightning },
    renderer: { ...defaultOptions.renderer, ...options.renderer },
    controls: { ...defaultOptions.controls, ...options.controls },
    helpers: { ...defaultOptions.helpers, ...options.helpers },
  }), [options]);

  useEffect(() => {
    if (!mountRef.current) return;

    const resize = () => updateSize(
      rendererRef.current as THREE.WebGLRenderer,
      cameraRef.current as THREE.PerspectiveCamera,
      mountRef,
      sceneRef.current as THREE.Scene
    );
    const resizeHandler = throttle(resize, 50);

    const {
      renderer,
      scene,
      camera,
      controls
    } = setupScene(
      { mountRef, rendererRef, cameraRef, sceneRef },
      object,
      mergedOptions
    );

    // Store references
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;

    resize(); // Initial size update

    window.addEventListener('resize', resizeHandler);
    console.log('main useEffect')
    return () => cleanupScene(mountRef, renderer, resizeHandler);
  }, [object, mergedOptions]);

  return <div style={{ width: '100%', height: '100%' }} ref={mountRef} />;
};

export default SimpleViewer;
