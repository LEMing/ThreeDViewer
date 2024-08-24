import * as THREE from 'three';
import { HelperOptions } from '../types';
import HexGrid from './HexGrid/HexGrid';
import { UNITS_PER_FOOT } from './constants';

export const addHelpers = (scene: THREE.Scene, object: THREE.Object3D | null, options: HelperOptions) => {
  scene.children = scene.children.filter(child => !(child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper || child instanceof THREE.BoxHelper));

  if (options.gridHelper) {
    const grid = new HexGrid(3, 12);
    grid.addToScene(scene);

    const planeGeometry = new THREE.PlaneGeometry(6 * UNITS_PER_FOOT, 6 * UNITS_PER_FOOT);
    const planeMaterial = new THREE.ShadowMaterial({
      opacity: 0.5,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add(plane);
  }

  if (options.axesHelper) {
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
  }

  if (options.object3DHelper && object) {
    const boxHelper = new THREE.BoxHelper(object, 0xff0000);
    scene.add(boxHelper);
  }
};
