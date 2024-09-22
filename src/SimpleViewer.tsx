import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {MapControls} from 'three/examples/jsm/controls/MapControls';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Gizmo} from 'threedgizmo';

import {cleanupScene} from './ThreeSceneSetup/cleanupScene';
import {TIME_PER_FRAME} from './ThreeSceneSetup/constants';
import {SceneManager} from './ThreeSceneSetup/setupScene/SceneManager';
import {updateSize} from './ThreeSceneSetup/updateSize';
import {SimpleViewerProps, SimpleViewerOptions} from './types';
import {throttle} from './utils';
import defaultOptions from './defaultOptions';

const SimpleViewer: React.FC<SimpleViewerProps> = ({ object, options = defaultOptions }) => {
  const mountRef = options.threeBaseRefs.mountPoint || useRef<HTMLDivElement | null>(null);
  const rendererRef = options.threeBaseRefs.renderer || useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = options.threeBaseRefs.camera || useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = options.threeBaseRefs.scene || useRef<THREE.Scene | null>(null);
  const controlsRef = options.threeBaseRefs.controls || useRef<OrbitControls | MapControls | null>(null);

  const [forceUpdate, setForceUpdate] = useState(0);
  const [completedImage, setRenderCompleteImage] = useState<string | null>(null); // Стейт для изображения
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);

  useEffect(() => {
    setForceUpdate(forceUpdate + 1);
  }, []);

  const mergedOptions = useMemo<SimpleViewerOptions>(() => ({
    ...defaultOptions,
    ...options,
  }), [options]);

  const resize = useCallback(() => updateSize(
    rendererRef.current as THREE.WebGLRenderer,
    cameraRef.current as THREE.PerspectiveCamera,
    mountRef,
    sceneRef.current as THREE.Scene
  ), []);

  useEffect(() => {
    if (!mountRef.current) return;
    const resizeHandler = throttle(resize, TIME_PER_FRAME);
    const threeBase = { mountRef, rendererRef, cameraRef, sceneRef };

    // Инициализация SceneManager с передачей функции для управления завершенным рендером (image)
    const sceneManagerInstance = new SceneManager(threeBase, object, mergedOptions, setRenderCompleteImage);
    setSceneManager(sceneManagerInstance);

    const {
      renderer,
      scene,
      camera,
      controls,
    } = sceneManagerInstance.getSceneElements();

    // Store references
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;

    resize(); // Initial size update

    window.addEventListener('resize', resizeHandler);
    return () => cleanupScene(mountRef, renderer, resizeHandler);
  }, [object, mergedOptions, resize]);

  const render = useCallback(() => {
    if (rendererRef.current && controlsRef.current) {
      controlsRef.current.update();

      // Если Path Tracer активен, обновляем его
      if (mergedOptions.usePathTracing && sceneManager && sceneManager.pathTracingManager) {
        sceneManager.pathTracingManager.updatePathTracerRenderer();
        sceneManager.pathTracingManager.ptRenderer.renderSample();
      } else {
        rendererRef.current.render(sceneRef.current as THREE.Scene, cameraRef.current as THREE.PerspectiveCamera);
      }
    }
  }, [sceneManager]);

  // Если рендер завершен и опция `replaceWithScreenshotOnComplete` включена, показать изображение
  if (mergedOptions.replaceWithScreenshotOnComplete && completedImage) {
    return <img src={completedImage} alt="Render Complete" />;
  }

  return (
    <>
      {options.helpers.addGizmo ? (
        <Gizmo
          camera={cameraRef.current}
          controls={controlsRef.current}
          render={render}
        />
      ) : null}
      <div style={{ width: '100%', height: '100%' }} ref={mountRef} />
    </>
  );
};

export default SimpleViewer;
