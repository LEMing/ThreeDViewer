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
const setupGizmo = (
  gizmoRef: React.RefObject<HTMLDivElement>,
  gizmoScene: THREE.Scene,
  gizmoRenderer: THREE.WebGLRenderer,
  gizmoCamera: THREE.PerspectiveCamera,
  cubeRef: React.MutableRefObject<THREE.Group | null>,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  renderGizmo: () => void,
  render: () => void
) => {
  // Настраиваем рендерер и камеру гизмо
  setupRenderer(gizmoRenderer, gizmoRef.current!, gizmoCamera);

  // Создаем и добавляем куб на сцену
  const cube = GizmoCube(gizmoScene);
  cubeRef.current = cube;

  // Добавляем освещение
  addLighting(gizmoScene, defaultOptions.lightning);

  // Добавляем обработчик изменений камеры
  const onChangeListener = () => syncCubeWithCamera(cube, camera, renderGizmo);
  controls.addEventListener('change', onChangeListener);

  // Настраиваем обработчики событий для куба
  setupEventHandlers(cube, camera, render);

  // Анимация рендеринга гизмо
  const animate = () => {
    requestAnimationFrame(animate);
    gizmoRenderer.render(gizmoScene, gizmoCamera);
  };
  animate();

  // Возвращаем функцию для очистки
  return () => {
    controls.removeEventListener('change', onChangeListener);
    gizmoScene.clear(); // Очищаем сцену при размонтировании
  };
};

const Gizmo: React.FC<GizmoProps> = ({ camera, controls, render }) => {
  const gizmoRef = useRef<HTMLDivElement | null>(null);
  const gizmoScene = useRef(new THREE.Scene()).current;
  const gizmoRenderer = useRef(new THREE.WebGLRenderer({ alpha: true, antialias: true })).current;
  const gizmoCamera = useRef(new THREE.PerspectiveCamera(50, 1, 0.1, 100)).current;
  const cubeRef = useRef<THREE.Group | null>(null);

  const renderGizmo = useCallback(() => {
    if (!cubeRef.current) return;
    render();
    gizmoRenderer.render(gizmoScene, gizmoCamera);
    console.log('rendered everything');
  }, [render]);

  useEffect(() => {
    if (!gizmoRef.current || !camera || !controls) return;

    // Настраиваем сцену и рендерер
    const cleanup = setupGizmo(gizmoRef, gizmoScene, gizmoRenderer, gizmoCamera, cubeRef, camera, controls, renderGizmo, render);

    return cleanup;
  }, [camera, controls, gizmoRenderer, gizmoScene, gizmoCamera, renderGizmo, render]);

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube || !camera) return;

    const syncCube = async() => {
      console.log('--initial sync');
      await syncCubeWithCamera(cube, camera, renderGizmo);
      console.log('--synced');
    };

    syncCube().then(() => {
      console.log('Promise resolved');
    });
  }, [camera, renderGizmo]);

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
