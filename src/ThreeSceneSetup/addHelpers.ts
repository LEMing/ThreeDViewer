import * as THREE from 'three';
import { HelperOptions } from '../types';
import HexGrid from './HexGrid/HexGrid';

export const addHelpers =(scene: THREE.Scene, object: THREE.Object3D | null, options: HelperOptions) => {
  scene.children = scene.children.filter(child => !(child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper || child instanceof THREE.BoxHelper));

  if (options.gridHelper) {
    const grid = new HexGrid(3, 12, options.color);
    grid.addToScene(scene);
  }

  if (options.axesHelper) {
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
  }

  if (options.object3DHelper && object) {
    const boxHelper = new THREE.BoxHelper(object, new THREE.Color(options.color));
    scene.add(boxHelper);
  }
};
