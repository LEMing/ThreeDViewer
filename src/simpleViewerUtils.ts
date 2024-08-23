import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FloorAligner from './FloorAligner';

const UNITS_PER_INCH = 1;
const UNITS_PER_FOOT = 12 * UNITS_PER_INCH;
const BACKGROUND_COLOR = 0xf0f0f7;

export const initializeScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  return scene;
};

export const initializeCamera = (aspectRatio: number) => {
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100000);
  return camera;
};

export const initializeRenderer = () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  return renderer;
};

export const addLighting = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0x404040, Math.PI);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(hemisphereLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, Math.PI);
  directionalLight.position.set(6 * UNITS_PER_FOOT, 6 * UNITS_PER_FOOT, 6 * UNITS_PER_FOOT);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;

  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50 * UNITS_PER_FOOT;
  directionalLight.shadow.camera.left = -10 * UNITS_PER_FOOT;
  directionalLight.shadow.camera.right = 10 * UNITS_PER_FOOT;
  directionalLight.shadow.camera.top = 10 * UNITS_PER_FOOT;
  directionalLight.shadow.camera.bottom = -10 * UNITS_PER_FOOT;

  directionalLight.shadow.bias = -0.001;

  directionalLight.shadow.radius = 1;

  scene.add(directionalLight);
};

export const addHelpers = (scene: THREE.Scene, object?: THREE.Object3D | null) => {
  const gridHelper = new THREE.GridHelper(6 * UNITS_PER_FOOT, 6);
  scene.add(gridHelper);

  const planeGeometry = new THREE.PlaneGeometry(6 * UNITS_PER_FOOT, 6 * UNITS_PER_FOOT);
  const planeMaterial = new THREE.ShadowMaterial({
    opacity: 0.5,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;
  scene.add(plane);

  if (object) {
    const boxHelper = new THREE.BoxHelper(object, 0xff0000); // Red box around the object
    scene.add(boxHelper);
  }
};

export const updateSize = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  mountRef: React.RefObject<HTMLDivElement>,
  scene: THREE.Scene,
) => {
  if (mountRef.current) {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
};

export const fitCameraToObject = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  cameraZ *= 1.4; // Add a bit of padding to the distance

  camera.position.set(center.x + cameraZ, center.y + cameraZ / 3, center.z + cameraZ / 5);
  camera.lookAt(center);

  camera.updateProjectionMatrix();
};

type THREEBase = {
  mountRef: React.RefObject<HTMLDivElement>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  sceneRef: React.MutableRefObject<THREE.Scene | null>;
};

export const setupScene = (threeBase: THREEBase, object: THREE.Object3D | null) => {
  const { mountRef, sceneRef, rendererRef, cameraRef } = threeBase;
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

  return { scene, camera, renderer, controls };
};

export const cleanupScene = (
  mountRef: React.RefObject<HTMLDivElement>,
  renderer: THREE.WebGLRenderer,
  resizeHandler: () => void,
) => {
  window.removeEventListener('resize', resizeHandler);
  if (mountRef.current) {
    mountRef.current.removeChild(renderer.domElement);
  }
};
