import * as THREE from 'three';
import defaultOptions from '../../defaultOptions';
import { HelperOptions } from '../../types';
import { addHelpers } from '../addHelpers';
import HexGrid from '../HexGrid/HexGrid';

jest.mock('../HexGrid/HexGrid');

describe('addHelpers', () => {
  let scene: THREE.Scene;
  let object: THREE.Object3D;
  let options: HelperOptions;

  beforeEach(() => {
    scene = new THREE.Scene();
    object = new THREE.Object3D();
    options = {
      ...defaultOptions.helpers,
      gridHelper: true,
      axesHelper: true,
      object3DHelper: true,
      color: '#FFFFFF',
    };
    (HexGrid as jest.Mock).mockClear();
  });

  test('removes existing helpers from the scene', () => {
    const existingGridHelper = new THREE.GridHelper();
    const existingAxesHelper = new THREE.AxesHelper();
    const existingBoxHelper = new THREE.BoxHelper(new THREE.Object3D());
    scene.add(existingGridHelper, existingAxesHelper, existingBoxHelper);

    addHelpers(scene, object, options);

    expect(scene.children).not.toContain(existingGridHelper);
    expect(scene.children).not.toContain(existingAxesHelper);
    expect(scene.children).not.toContain(existingBoxHelper);
  });

  test('adds HexGrid when gridHelper option is true', () => {
    const mockAddToScene = jest.fn();
    (HexGrid as jest.Mock).mockImplementation(() => ({
      addToScene: mockAddToScene,
    }));

    addHelpers(scene, object, options);

    expect(HexGrid).toHaveBeenCalledWith(3, 12, options.color);
    expect(mockAddToScene).toHaveBeenCalledWith(scene);
  });

  test('adds AxesHelper when axesHelper option is true', () => {
    addHelpers(scene, object, options);

    const axesHelper = scene.children.find(child => child instanceof THREE.AxesHelper);
    expect(axesHelper).toBeTruthy();
    expect(axesHelper).toBeInstanceOf(THREE.AxesHelper);
  });

  test('adds BoxHelper when object3DHelper option is true and object is provided', () => {
    addHelpers(scene, object, options);

    const boxHelper = scene.children.find(child => child instanceof THREE.BoxHelper);
    expect(boxHelper).toBeTruthy();
    expect(boxHelper).toBeInstanceOf(THREE.BoxHelper);
    if (boxHelper instanceof THREE.BoxHelper) {
      expect(boxHelper.material.color).toEqual(new THREE.Color(options.color));
    }
  });

  test('does not add helpers when options are false', () => {
    options = {
      ...defaultOptions.helpers,
      gridHelper: false,
      axesHelper: false,
      object3DHelper: false,
      color: '#FFFFFF',
    };

    addHelpers(scene, object, options);

    expect(HexGrid).not.toHaveBeenCalled();
    expect(scene.children.length).toBe(0);
  });

  test('does not add BoxHelper when object is null', () => {
    options.object3DHelper = true;
    addHelpers(scene, null, options);

    const boxHelper = scene.children.find(child => child instanceof THREE.BoxHelper);
    expect(boxHelper).toBeFalsy();
  });
});
