import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { syncGizmoCameraWithMain } from './CameraController';
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
 
  // Force rendering of the gizmo after synchronization
  const renderGizmo = useCallback(() => {
    render();
    gizmoRenderer.render(gizmoScene, gizmoCamera);
  }, [render, gizmoRenderer, gizmoScene, gizmoCamera]);

  // Set up the gizmo scene and renderer
  useEffect(() => {
    const gizmoDiv = gizmoRef.current;
    if (!gizmoDiv || !camera || !controls) return;

    // Setup the gizmo with the necessary parameters
    const cleanup = setupGizmo({
      gizmo: {
        gizmoDiv,
        gizmoScene,
        gizmoRenderer,
        gizmoCamera,
      },
      main: {
        mainCamera: camera,
        mainControls: controls,
        renderGizmo,
      },
    });

    return cleanup;
  }, [camera, controls, gizmoRenderer, gizmoScene, gizmoCamera, renderGizmo]);

  // Synchronize the gizmo camera with the main camera and force rendering
  useEffect(() => {
    if (!camera) return;
    syncGizmoCameraWithMain(gizmoCamera, camera);
    renderGizmo();
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
