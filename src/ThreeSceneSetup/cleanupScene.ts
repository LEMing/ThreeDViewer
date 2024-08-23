import React from 'react';
import * as THREE from 'three';

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
