import * as THREE from 'three';
import {UNITS_PER_FOOT} from './constants';
import HexGrid from './HexGrid/HexGrid';

export const addHelpers = (scene: THREE.Scene, object?: THREE.Object3D | null) => {

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

  if (object) {
    const boxHelper = new THREE.BoxHelper(object, 0xff0000); // Red box around the object
    scene.add(boxHelper);
  }
};
