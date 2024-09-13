import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Gizmo from './Gizmo/Gizmo';

import { cleanupScene } from './ThreeSceneSetup/cleanupScene';
import { TIME_PER_FRAME } from './ThreeSceneSetup/constants';
import { setupScene } from './ThreeSceneSetup/setupScene';
import { updateSize } from './ThreeSceneSetup/updateSize';
import { SimpleViewerProps, SimpleViewerOptions } from './types';
import { throttle } from './utils';
import defaultOptions from './defaultOptions'; // Import the default options

const SimpleViewer: React.FC<SimpleViewerProps> = ({ object, options = defaultOptions }) => {
  const mountRef = options.threeBaseRefs.mountPoint || useRef<HTMLDivElement | null>(null);
  const rendererRef = options.threeBaseRefs.renderer || useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = options.threeBaseRefs.camera || useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = options.threeBaseRefs.scene || useRef<THREE.Scene | null>(null);
  const controlsRef = options.threeBaseRefs.controls || useRef<OrbitControls | null>(null);

  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Force a re-render after hot update to ensure synchronization
    setForceUpdate(forceUpdate + 1);
  }, []);
  const mergedOptions = useMemo<SimpleViewerOptions>(() => ({
    ...defaultOptions,
    ...options,
  }), [options]);

  useEffect(() => {
    if (!mountRef.current) return;

    const resize = () => updateSize(
      rendererRef.current as THREE.WebGLRenderer,
      cameraRef.current as THREE.PerspectiveCamera,
      mountRef,
      sceneRef.current as THREE.Scene
    );
    const resizeHandler = throttle(resize, TIME_PER_FRAME);

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
    return () => cleanupScene(mountRef, renderer, resizeHandler);
  }, [object, mergedOptions]);

  const render = useCallback(() => {
    if (rendererRef.current) {
      rendererRef.current.render(sceneRef.current as THREE.Scene, cameraRef.current as THREE.PerspectiveCamera);
    }
  }, []);

  return (
    <>
      {(
        <Gizmo camera={cameraRef.current} controls={controlsRef.current} render={render} />
      )}
    <div style={{ width: '100%', height: '100%' }} ref={mountRef}/>
    </>
  );
};

export default SimpleViewer;
