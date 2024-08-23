import * as THREE from 'three';
import {UNITS_PER_FOOT} from './constants';

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
