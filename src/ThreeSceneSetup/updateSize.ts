import React from 'react';
import * as THREE from 'three';

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
