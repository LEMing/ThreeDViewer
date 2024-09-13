import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { syncGizmoCameraWithMain, syncMainCameraWithGizmo } from './CameraController';
import getWebGLRenderer from './getWebGLRenderer';
import GizmoControl from './GizmoControl';

interface GizmoProps {
  camera: THREE.Camera | null;
  controls: OrbitControls | null;
  render: () => void;
}

const Gizmo: React.FC<GizmoProps> = ({ camera, controls, render }) => {
  const gizmoRef = useRef<HTMLDivElement | null>(null);
  const gizmoScene = useRef(new THREE.Scene()).current;
  const gizmoRenderer = useRef(getWebGLRenderer()).current;
  const gizmoCamera = useRef(new THREE.PerspectiveCamera(50, 1, 0.1, 100)).current;
  const gizmoControlRef = useRef<GizmoControl | null>(null);

  // Force rendering of the gizmo after synchronization
  const renderGizmo = useCallback(() => {
    if (!gizmoRenderer) return;
    render();
    gizmoRenderer.render(gizmoScene, gizmoCamera);
  }, [render, gizmoRenderer, gizmoScene, gizmoCamera]);

  // Set up the gizmo scene and renderer
  useEffect(() => {
    const gizmoDiv = gizmoRef.current;
    if (!gizmoDiv || !camera || !controls || !gizmoRenderer) return;


    // If there's an existing GizmoControl instance, dispose of it
    if (gizmoControlRef.current) {
      gizmoControlRef.current.dispose();
    }

    // Prepare the parameters for GizmoControl
    const gizmoParams = {
      gizmoDiv,
      gizmoScene,
      gizmoRenderer,
      gizmoCamera,
    };

    const mainParams = {
      mainCamera: camera,
      mainControls: controls,
      renderGizmo,
    };

    const syncFunctions = {
      syncGizmoCameraWithMain,
      syncMainCameraWithGizmo,
    };

    // Instantiate the GizmoControl class
    gizmoControlRef.current = new GizmoControl({
      gizmoParams,
      mainParams,
      syncFunctions,
    });

    // Cleanup function when the component unmounts or dependencies change
    return () => {
      if (gizmoControlRef.current) {
        gizmoControlRef.current.dispose();
        gizmoControlRef.current = null;
      }
    };
  }, [camera, controls, renderGizmo]);

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
