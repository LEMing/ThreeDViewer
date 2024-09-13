import * as THREE from 'three';

export const setupRenderer = (
  renderer: THREE.WebGLRenderer,
  mountElement: HTMLDivElement,
) => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(100, 100);
  mountElement.appendChild(renderer.domElement);
};
