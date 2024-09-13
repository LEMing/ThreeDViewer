import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { defaultOptions } from '../index';
import { addLighting } from '../ThreeSceneSetup/addLighting';
import { syncGizmoCameraWithMain, syncMainCameraWithGizmo } from './CameraController';
import { GizmoCube } from './GizmoCube';
import { setupRenderer } from './RendererSetup';

interface GizmoParams {
  gizmoDiv: HTMLDivElement;
  gizmoScene: THREE.Scene;
  gizmoRenderer: THREE.WebGLRenderer;
  gizmoCamera: THREE.PerspectiveCamera;
}

interface MainParams {
  mainCamera: THREE.PerspectiveCamera;
  mainControls: OrbitControls;
  renderGizmo: () => void;
}

interface SetupGizmoParams {
  gizmo: GizmoParams;
  main: MainParams;
}

const setupGizmo = ({ gizmo, main }: SetupGizmoParams) => {
  const { gizmoDiv, gizmoScene, gizmoRenderer, gizmoCamera } = gizmo;
  const { mainCamera, mainControls, renderGizmo } = main;

  setupRenderer(gizmoRenderer, gizmoDiv);

  GizmoCube(gizmoScene);

  addLighting(gizmoScene, defaultOptions.lightning);

  const onChangeMainControlsListener = () => syncGizmoCameraWithMain(gizmoCamera, mainCamera);

  mainControls.addEventListener('change', onChangeMainControlsListener);

  const gizmoControls = new OrbitControls(gizmoCamera, gizmoRenderer.domElement);
  gizmoControls.update();

  const onChangeGizmoControlsListener = () => {
    syncMainCameraWithGizmo(mainCamera, gizmoCamera);
    renderGizmo();
  };

  gizmoControls.addEventListener('change', onChangeGizmoControlsListener);

  const animate = () => {
    requestAnimationFrame(animate);
    gizmoRenderer.render(gizmoScene, gizmoCamera);
  };
  animate();

  return () => {
    mainControls.removeEventListener('change', onChangeMainControlsListener);
    gizmoControls.removeEventListener('change', onChangeGizmoControlsListener);
    gizmoScene.clear();
  };
};

export default setupGizmo;
