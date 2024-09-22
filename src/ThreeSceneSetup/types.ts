import React from 'react';
import * as THREE from 'three';

export type THREEBase = {
  mountRef: React.RefObject<HTMLDivElement>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
  sceneRef: React.MutableRefObject<THREE.Scene | null>;
};
