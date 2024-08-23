import * as THREE from 'three';
import {BACKGROUND_COLOR} from './constants';

export const initializeScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  return scene;
};
