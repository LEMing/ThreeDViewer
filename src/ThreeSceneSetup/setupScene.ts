import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FloorAligner from '../FloorAligner';
import { addHelpers } from './addHelpers';
import { addLighting } from './addLighting';
import { fitCameraToObject } from './fitCameraToObject';
import { initializeCamera } from './initializeCamera';
import { initializeRenderer } from './initializeRenderer';
import { initializeScene } from './initializeScene';
import { THREEBase } from './types';
import { SimpleViewerOptions } from '../types';

export const setupScene = (
  threeBase: THREEBase,
  object: THREE.Object3D | null,
  options: SimpleViewerOptions
) => {
  const { mountRef, sceneRef, rendererRef, cameraRef } = threeBase;
  if (!mountRef.current) throw new Error('Mount div is not ready');

  const scene = initializeScene(options);
  const camera = initializeCamera(
    mountRef.current.clientWidth / mountRef.current.clientHeight,
    options.camera
  );
  const renderer = initializeRenderer(options.renderer);

  rendererRef.current = renderer;
  cameraRef.current = camera;
  sceneRef.current = scene;

  mountRef.current.appendChild(renderer.domElement);

  if (object) {
    object.castShadow = true;
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    new FloorAligner(object).alignToFloor();
    scene.add(object);
  }

  addLighting(scene, options.lightning);
  addHelpers(scene, object, options.helpers);

  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, options.controls);
  controls.update();

  if (options.camera.autoFitToObject) {
    fitCameraToObject(scene, camera);
  }

  const center = new THREE.Vector3();
  scene.position.copy(center);
  controls.target.copy(center);
  controls.update();

  let isSceneActive = false;

  const startRendering = () => {
    if (!isSceneActive) {
      isSceneActive = true;
      animate();
    }
  };

  const stopRendering = () => {
    isSceneActive = false;
  };

  controls.addEventListener('start', startRendering);
  controls.addEventListener('end', stopRendering);

  const animate = () => {
    if (!isSceneActive) return;
    requestAnimationFrame(animate);
    controls.update();

    if (object) {
      renderer.shadowMap.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  animate();

  return { scene, camera, renderer, controls };
};
