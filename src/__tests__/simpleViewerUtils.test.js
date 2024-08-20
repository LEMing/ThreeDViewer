import * as THREE from 'three';
import { mockRenderer } from '../__mocks__/mockRenderer';
import { initializeScene, initializeCamera, initializeRenderer, addLighting, addHelpers, updateSize, fitCameraToObject, setupScene, cleanupScene, } from '../simpleViewerUtils';
jest.mock('three', () => {
    const originalThree = jest.requireActual('three');
    return {
        ...originalThree,
        WebGLRenderer: jest.fn(() => mockRenderer),
    };
});
jest.mock('three/examples/jsm/controls/OrbitControls', () => {
    return {
        OrbitControls: jest.fn().mockImplementation(() => {
            return {
                update: jest.fn(),
                enableDamping: true,
                dampingFactor: 0.25,
                enableZoom: true,
            };
        }),
    };
});
afterAll(() => {
    jest.resetAllMocks();
});
describe('Scene setup functions', () => {
    test('initializeScene creates a scene with the correct background color', () => {
        const scene = initializeScene();
        expect(scene).toBeInstanceOf(THREE.Scene);
        expect(scene.background).toEqual(new THREE.Color(0xf0f0f7));
    });
    test('initializeCamera creates a camera with the correct aspect ratio and properties', () => {
        const aspectRatio = 16 / 9;
        const camera = initializeCamera(aspectRatio);
        expect(camera).toBeInstanceOf(THREE.PerspectiveCamera);
        expect(camera.aspect).toBe(aspectRatio);
        expect(camera.fov).toBe(75);
    });
    test('initializeRenderer creates a renderer with the correct properties', () => {
        const renderer = initializeRenderer();
        expect(renderer.shadowMap.enabled).toBe(true);
        expect(renderer.getPixelRatio()).toBe(window.devicePixelRatio);
    });
    test('addLighting adds ambient and directional lights to the scene', () => {
        const scene = new THREE.Scene();
        addLighting(scene);
        expect(scene.children.some((obj) => obj instanceof THREE.AmbientLight)).toBe(true);
        expect(scene.children.some((obj) => obj instanceof THREE.DirectionalLight)).toBe(true);
    });
    test('addHelpers adds grid helper and plane to the scene', () => {
        const scene = new THREE.Scene();
        addHelpers(scene);
        expect(scene.children.some((obj) => obj instanceof THREE.GridHelper)).toBe(true);
        expect(scene.children.some((obj) => obj instanceof THREE.Mesh && obj.geometry instanceof THREE.PlaneGeometry)).toBe(true);
    });
    test('updateSize updates the renderer size and camera aspect ratio', () => {
        const renderer = new THREE.WebGLRenderer();
        const camera = new THREE.PerspectiveCamera();
        const mountRef = { current: document.createElement('div') };
        Object.defineProperty(mountRef.current, 'clientWidth', { value: 800 });
        Object.defineProperty(mountRef.current, 'clientHeight', { value: 600 });
        updateSize(renderer, camera, mountRef);
        expect(renderer.getSize(new THREE.Vector2()).width).toBe(0);
        expect(renderer.getSize(new THREE.Vector2()).height).toBe(0);
        expect(camera.aspect).toBe(800 / 600);
    });
    test('fitCameraToObject adjusts the camera to fit the scene objects', () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();
        const box = new THREE.Box3(new THREE.Vector3(-5, -5, -5), new THREE.Vector3(5, 5, 5));
        jest.spyOn(THREE.Box3.prototype, 'setFromObject').mockReturnValue(box);
        fitCameraToObject(scene, camera);
        expect(camera.position.z).toBeCloseTo(3);
        expect(camera.position.x).toBeCloseTo(15, 1);
        expect(camera.position.y).toBeCloseTo(5, 1);
    });
    test('setupScene sets up the scene, camera, renderer, and controls correctly', () => {
        const mountRef = { current: document.createElement('div') };
        const rendererRef = { current: null };
        const cameraRef = { current: null };
        const object = new THREE.Object3D();
        const { scene, camera, renderer, controls } = setupScene({ mountRef, rendererRef, cameraRef }, object);
        expect(scene).toBeInstanceOf(THREE.Scene);
        expect(camera).toBeInstanceOf(THREE.PerspectiveCamera);
        expect(controls.enableZoom).toBeTruthy();
        expect(object.castShadow).toBe(true);
        expect(scene.children.includes(object)).toBe(true);
        expect(rendererRef.current).toBe(renderer);
        expect(cameraRef.current).toBe(camera);
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
