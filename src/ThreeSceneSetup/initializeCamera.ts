import * as THREE from 'three';

export const initializeCamera = (aspectRatio: number) => {
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100000);
  return camera;
};
