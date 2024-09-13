import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {syncGizmoCameraWithMain} from './CameraController';
import setupGizmo from './setupGizmo';

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

  // Принудительный рендеринг гизмо после каждой синхронизации
  const renderGizmo = useCallback(() => {
    render();
    gizmoRenderer.render(gizmoScene, gizmoCamera);
  }, [render]);

  // Настройка сцены и рендерера
  useEffect(() => {
    const gizmoDiv = gizmoRef.current;
    if (!gizmoDiv || !camera || !controls) return;

    const cleanup = setupGizmo(
      gizmoDiv,
      gizmoScene,
      gizmoRenderer,
      gizmoCamera,
      cubeRef,
      camera,
      controls,
      renderGizmo,
    );

    return cleanup;
  }, [camera, controls, gizmoRenderer, gizmoScene, gizmoCamera, renderGizmo, render]);

  // Синхронизация куба с камерой и принудительный рендер
  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube || !camera) return;

    const sync = () => {
      console.log('--initial sync');
      syncGizmoCameraWithMain(gizmoCamera, camera);
      console.log('--synced');
      renderGizmo(); // Принудительный вызов рендеринга после синхронизации
    };

    sync();
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
