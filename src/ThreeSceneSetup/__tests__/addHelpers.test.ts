import * as THREE from 'three';
import defaultOptions from '../../defaultOptions';
import {addHelpers} from '../addHelpers';

test('addHelpers adds grid helper and plane to the scene', () => {
  const scene = new THREE.Scene();
  addHelpers(scene, new THREE.Object3D(), defaultOptions.helpers);
  expect(scene.children.some((obj) => obj instanceof THREE.LineSegments)).toBe(true);
  expect(scene.children.some((obj) => obj instanceof THREE.Mesh && obj.geometry instanceof THREE.PlaneGeometry)).toBe(
    true,
  );
});
