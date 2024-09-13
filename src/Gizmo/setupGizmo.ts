import React from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {defaultOptions} from '../index';
import {addLighting} from '../ThreeSceneSetup/addLighting';
import {syncCubeWithCamera} from './CameraController';
import {GizmoCube} from './GizmoCube';
import {setupEventHandlers} from './GizmoEventHandlers';
import {setupRenderer} from './RendererSetup';

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

export default setupGizmo;
