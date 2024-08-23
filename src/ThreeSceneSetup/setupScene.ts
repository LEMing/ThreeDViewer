import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import FloorAligner from '../FloorAligner';
import {addHelpers} from './addHelpers';
import {addLighting} from './addLighting';
import {fitCameraToObject} from './fitCameraToObject';
import {initializeCamera} from './initializeCamera';
import {initializeRenderer} from './initializeRenderer';
import {initializeScene} from './initializeScene';
import {THREEBase} from './types';

export const setupScene = (threeBase: THREEBase, object: THREE.Object3D | null) => {
  const {mountRef, sceneRef, rendererRef, cameraRef} = threeBase;
  if (!mountRef.current) throw new Error('Mount div is not ready');
  const scene = initializeScene();
  const camera = initializeCamera(mountRef.current.clientWidth / mountRef.current.clientHeight);
  const renderer = initializeRenderer();

  rendererRef.current = renderer;
  cameraRef.current = camera;
  sceneRef.current = scene;

  mountRef.current.appendChild(renderer.domElement);

  if (object) {
    object.castShadow = true; // Ensure the object casts shadows
    object.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
    new FloorAligner(object).alignToFloor();
    scene.add(object);
  }

  addLighting(scene);
  addHelpers(scene);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  fitCameraToObject(scene, camera);

  const center = new THREE.Vector3();
  scene.position.copy(center);
  controls.target.copy(center);
  controls.update();

  // State to track whether the scene is active
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
    if (!isSceneActive) return; // Stop the loop if the scene is inactive
    requestAnimationFrame(animate);
    controls.update();

    if (object) {
      renderer.shadowMap.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  animate();

  return {scene, camera, renderer, controls};
};
