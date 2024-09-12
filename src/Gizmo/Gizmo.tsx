import React, {useCallback, useEffect, useRef} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {defaultOptions} from '../index';
import { setupRenderer } from './RendererSetup';
import { syncCubeWithCamera } from './CameraController';
import { addLighting } from '../ThreeSceneSetup/addLighting';
import { GizmoCube } from './GizmoCube';
import { setupEventHandlers } from './GizmoEventHandlers';

interface GizmoProps {
  camera: THREE.PerspectiveCamera | null;
  controls: OrbitControls | null;
  render: () => void;
}

const Gizmo: React.FC<GizmoProps> = ({ camera, controls, render }) => {
  const gizmoRef = useRef<HTMLDivElement | null>(null);
  const gizmoScene = useRef(new THREE.Scene()).current;
  const gizmoRenderer = useRef(new THREE.WebGLRenderer({ alpha: true, antialias: true })).current;
  const gizmoCamera = useRef(new THREE.PerspectiveCamera(50, 1, 0.1, 100)).current;
  const cubeRef = useRef<THREE.Group | null>(null);


  const renderGizmo = useCallback(() => {
    console.log('renderGizmo')
    gizmoRenderer.render(gizmoScene, gizmoCamera);
  }, []);

  useEffect(() => {
    const cube = cubeRef.current;
    if (!gizmoRef.current || !cube || !camera ) return;
    const syncCube = async() => {
      console.log('initial sync');
      await syncCubeWithCamera(cube, camera, renderGizmo);
      console.log('synced');
    }
    syncCube().then(() => {
      console.log('Promise resolved');
    });
  }, [camera, renderGizmo]);

  useEffect(() => {
    if (!gizmoRef.current || !camera || !controls) return;

    // Настраиваем рендерер и камеру гизмо
    setupRenderer(gizmoRenderer, gizmoRef.current, gizmoCamera);

    // Создаем и добавляем куб на сцену
    const cube = GizmoCube(gizmoScene);
    cubeRef.current = cube;

    // Добавляем освещение
    addLighting(gizmoScene, defaultOptions.lightning);

    const onChangeListener = () => syncCubeWithCamera(cube, camera, () => gizmoRenderer.render(gizmoScene, gizmoCamera));

    // Синхронизация куба с внешней камерой
    controls.addEventListener('change', onChangeListener);

    // Обработка событий мыши
    setupEventHandlers(cubeRef.current, camera, render);

    // Анимация рендеринга гизмо
    const animate = () => {
      requestAnimationFrame(animate);
      gizmoRenderer.render(gizmoScene, gizmoCamera);
    };
    animate();

    return () => {
      controls.removeEventListener('change', onChangeListener);
      gizmoScene.clear(); // Очищаем сцену при размонтировании
    };
  }, [camera, controls, gizmoRenderer, gizmoScene, gizmoCamera]);

  return (
    <div
      ref={gizmoRef}
      style={{
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
        cursor: 'pointer',
      }}
    />
  );
};

export default Gizmo;
