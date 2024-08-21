import * as THREE from 'three';
import Resizer from '../Resizer';

describe('Resizer', () => {
  let resizer: Resizer;

  beforeEach(() => {
    resizer = new Resizer();
  });

  it('should scale the object uniformly to fit within the given size', () => {
    const object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    const targetSize = new THREE.Vector3(10, 10, 10);

    resizer.resize(object, targetSize);

    const expectedScale = 10; // Since the object is 1x1x1, it should be scaled by 10
    expect(object.scale.x).toBeCloseTo(expectedScale);
    expect(object.scale.y).toBeCloseTo(expectedScale);
    expect(object.scale.z).toBeCloseTo(expectedScale);
  });

  it('should scale the object to fit the smallest dimension', () => {
    const object = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 4));
    const targetSize = new THREE.Vector3(10, 20, 10);

    resizer.resize(object, targetSize);

    const scaleFactor = 10 / 4; // The object should be scaled by 10/4 to fit within the z dimension
    expect(object.scale.x).toBeCloseTo(scaleFactor);
    expect(object.scale.y).toBeCloseTo(scaleFactor);
    expect(object.scale.z).toBeCloseTo(scaleFactor);
  });

  it('should not scale the object if it already fits within the given size', () => {
    const object = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5));
    const targetSize = new THREE.Vector3(10, 10, 10);

    resizer.resize(object, targetSize);

    const scaleFactor = 2; // The object should be scaled by 2 to fit within the box
    expect(object.scale.x).toBeCloseTo(scaleFactor);
    expect(object.scale.y).toBeCloseTo(scaleFactor);
    expect(object.scale.z).toBeCloseTo(scaleFactor);
  });

  it('should correctly handle non-uniform objects', () => {
    const object = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 3));
    const targetSize = new THREE.Vector3(6, 3, 9);

    resizer.resize(object, targetSize);

    const scaleFactor = 3; // The object should be scaled by 3 to fit within the smallest dimension (y-axis)
    expect(object.scale.x).toBeCloseTo(scaleFactor);
    expect(object.scale.y).toBeCloseTo(scaleFactor);
    expect(object.scale.z).toBeCloseTo(scaleFactor);
  });

  it('should update the world matrix of the object after scaling', () => {
    const object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    const targetSize = new THREE.Vector3(5, 5, 5);

    const updateMatrixWorldSpy = jest.spyOn(object, 'updateMatrixWorld');

    resizer.resize(object, targetSize);

    expect(updateMatrixWorldSpy).toHaveBeenCalledWith(true);
  });
});
