import * as THREE from 'three';

const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

const getWebGLRenderer = () => {
  if (isWebGLAvailable()) {
    return new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } else {
    console.error('WebGL is not supported in this environment.');
    return null;
  }
};

export default getWebGLRenderer;
