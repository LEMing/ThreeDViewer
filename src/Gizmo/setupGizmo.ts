import React from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {defaultOptions} from '../index';
import {addLighting} from '../ThreeSceneSetup/addLighting';
import {syncGizmoCameraWithMain, syncMainCameraWithGizmo} from './CameraController';
import {GizmoCube} from './GizmoCube';
import {setupRenderer} from './RendererSetup';

const setupGizmo = (
  gizmoDiv: HTMLDivElement,
  gizmoScene: THREE.Scene,
  gizmoRenderer: THREE.WebGLRenderer,
  gizmoCamera: THREE.PerspectiveCamera,
  cubeRef: React.MutableRefObject<THREE.Group | null>,
  mainCamera: THREE.PerspectiveCamera,
  mainControls: OrbitControls,
  renderGizmo: () => void,
) => {
  setupRenderer(gizmoRenderer, gizmoDiv);

  const cube = GizmoCube(gizmoScene);
  cubeRef.current = cube;

  addLighting(gizmoScene, defaultOptions.lightning);

  const onChangeMainControlsListener = async () => {
    syncGizmoCameraWithMain(gizmoCamera, mainCamera);
  };
  mainControls.addEventListener('change', onChangeMainControlsListener);

  const gizmoControls = new OrbitControls(gizmoCamera, gizmoRenderer.domElement);
  gizmoControls.update();

  const onChangeGizmoControlsListener = () => {
    syncMainCameraWithGizmo(mainCamera, gizmoCamera);
    console.log('Gizmo mainCamera position:', gizmoCamera.position);
    renderGizmo();
  }

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
