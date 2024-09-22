import * as THREE from 'three';
import { mockRenderer } from '../../__mocks__/mockRenderer';
import { mockContext } from '../../__mocks__/mock2DContext';
import defaultOptions from '../../defaultOptions';

import { addLighting } from '../addLighting';
import { cleanupScene } from '../cleanupScene';
import { fitCameraToObject } from '../fitCameraToObject';
import { initializeCamera } from '../setupScene/initializeCamera';
import { initializeRenderer } from '../setupScene/initializeRenderer';
import { initializeScene } from '../initializeScene';
import { updateSize } from '../updateSize';

jest.mock('../importRaytracer', () => ({
  importRaytracer: () => ({
    WebGLPathTracer: jest.fn(),
    PhysicalCamera: jest.fn(),
    BlurredEnvMapGenerator: jest.fn(),
  }),
}));

jest.mock('three', () => {
  const originalThree = jest.requireActual('three');
  return {
    ...originalThree,
    WebGLRenderer: jest.fn(() => mockRenderer),
  };
});

jest.mock('../get2DContext', () => ({
  get2DContext: jest.fn(() => mockContext),
}));

describe('Scene setup functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializeScene creates a scene with the correct background color', () => {
    const scene = initializeScene(defaultOptions);
    expect(scene).toBeInstanceOf(THREE.Scene);
    expect(scene.background).toEqual(new THREE.Color(defaultOptions.backgroundColor));
  });

  test('initializeCamera sets camera properties correctly', () => {
    const camera = new THREE.PerspectiveCamera();
    initializeCamera(camera, defaultOptions.camera);

    if (defaultOptions.camera.cameraPosition) {
      expect(camera.position.toArray()).toEqual(defaultOptions.camera.cameraPosition);
    }

    if (defaultOptions.camera.cameraTarget) {
      const lookAtVector = new THREE.Vector3();
      camera.getWorldDirection(lookAtVector);
      const expectedDirection = new THREE.Vector3().fromArray(defaultOptions.camera.cameraTarget).sub(camera.position).normalize();
      expect(lookAtVector.x).toBeCloseTo(expectedDirection.x, 5);
      expect(lookAtVector.y).toBeCloseTo(expectedDirection.y, 5);
      expect(lookAtVector.z).toBeCloseTo(expectedDirection.z, 5);
    }
  });

  test('initializeRenderer creates a renderer with the correct properties', () => {
    const renderer = initializeRenderer(defaultOptions.renderer);
    expect(renderer.shadowMap.enabled).toBe(defaultOptions.renderer.shadowMapEnabled);
    expect(renderer.getPixelRatio()).toBe(defaultOptions.renderer.pixelRatio);
    expect(renderer.shadowMap.type).toBe(defaultOptions.renderer.shadowMapType);
  });

  test('addLighting adds ambient and directional lights to the scene', () => {
    const scene = new THREE.Scene();
    addLighting(scene, defaultOptions.lightning);
    expect(scene.children.some((obj) => obj instanceof THREE.AmbientLight)).toBe(true);
    expect(scene.children.some((obj) => obj instanceof THREE.DirectionalLight)).toBe(true);
  });

  test('updateSize updates the renderer size and camera aspect ratio', () => {
    const renderer = new THREE.WebGLRenderer();
    const camera = new THREE.PerspectiveCamera();
    const mountRef = { current: document.createElement('div') };
    const scene = new THREE.Scene();

    Object.defineProperty(mountRef.current, 'clientWidth', { value: 800 });
    Object.defineProperty(mountRef.current, 'clientHeight', { value: 600 });

    const setSizeSpy = jest.spyOn(renderer, 'setSize');
    const renderSpy = jest.spyOn(renderer, 'render');

    updateSize(renderer, camera, mountRef, scene);

    expect(setSizeSpy).toHaveBeenCalledWith(800, 600);
    expect(renderSpy).toHaveBeenCalledWith(scene, camera);
    expect(camera.aspect).toBe(800 / 600);
  });

  test('fitCameraToObject adjusts the camera to fit the scene objects', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const box = new THREE.Box3(new THREE.Vector3(-5, -5, -5), new THREE.Vector3(5, 5, 5));
    jest.spyOn(THREE.Box3.prototype, 'setFromObject').mockReturnValue(box);

    fitCameraToObject(scene, camera);

    expect(camera.position.z).toBeGreaterThan(0);
    expect(camera.position.x).toBeCloseTo(0, 1);
    expect(camera.position.y).toBeCloseTo(0, 1);
  });

  test('cleanupScene removes the renderer from the DOM and event listeners', () => {
    const mountRef = { current: document.createElement('div') };
    const renderer = new THREE.WebGLRenderer();
    mountRef.current.appendChild(renderer.domElement);

    const resizeHandler = jest.fn();
    window.addEventListener('resize', resizeHandler);

    cleanupScene(mountRef, renderer, resizeHandler);

    expect(mountRef.current.children.length).toBe(0);
    expect(resizeHandler).not.toBeCalled();
  });
});
