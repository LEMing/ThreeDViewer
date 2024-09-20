import * as THREE from 'three';
import { SimpleViewerOptions } from '../types';

export const initializeScene = (options: SimpleViewerOptions) => {
  const scene = new THREE.Scene();


  // Use the backgroundColor from options, or fall back to a default if not provided
  const backgroundColor = options.backgroundColor
  scene.background = new THREE.Color(backgroundColor);

  return scene;
};
