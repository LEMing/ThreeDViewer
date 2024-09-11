import * as THREE from 'three';

export const setupRenderer = (
  renderer: THREE.WebGLRenderer,
  mountElement: HTMLDivElement,
  gizmoCamera: THREE.PerspectiveCamera
) => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(100, 100);
  mountElement.appendChild(renderer.domElement);

  // Настраиваем камеру для гизмо
  gizmoCamera.position.set(3, 3, 3);
  gizmoCamera.lookAt(0, 0, 0);
};
