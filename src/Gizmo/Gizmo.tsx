import React, { useEffect, useRef } from 'react';
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
  const scene = useRef(new THREE.Scene()).current;
  const renderer = useRef(new THREE.WebGLRenderer({ alpha: true, antialias: true })).current;
  const gizmoCamera = useRef(new THREE.PerspectiveCamera(50, 1, 0.1, 100)).current;
  const cubeRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!gizmoRef.current || !camera || !controls) return;

    // Настраиваем рендерер и камеру гизмо
    setupRenderer(renderer, gizmoRef.current, gizmoCamera);

    // Создаем и добавляем куб на сцену
    cubeRef.current = GizmoCube(scene);

    // Добавляем освещение
    addLighting(scene, defaultOptions.lightning);

    const onChangeListener = () => syncCubeWithCamera(cubeRef.current, camera, render);

    // Синхронизация куба с внешней камерой
    controls.addEventListener('change', onChangeListener);

    // Обработка событий мыши
    setupEventHandlers(cubeRef.current, camera, render);

    // Анимация рендеринга гизмо
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, gizmoCamera);
    };
    animate();

    return () => {
      controls.removeEventListener('change', onChangeListener);
      scene.clear(); // Очищаем сцену при размонтировании
    };
  }, [camera, controls, renderer, scene, gizmoCamera]);

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
