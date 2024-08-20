import { jsx as _jsx } from "react/jsx-runtime";
import { render } from '@testing-library/react';
import * as THREE from 'three';
import SimpleViewer from '../SimpleViewer';
import { setupScene, cleanupScene, updateSize } from '../simpleViewerUtils';
const mockCanvas = document.createElement('canvas');
jest.mock('three', () => {
    const originalThree = jest.requireActual('three');
    return {
        ...originalThree,
        WebGLRenderer: jest.fn(() => ({
            setPixelRatio: jest.fn(),
            shadowMap: { enabled: true },
            setSize: jest.fn(),
            getSize: jest.fn(() => ({ width: 800, height: 600 })),
            domElement: mockCanvas,
            render: jest.fn(),
        })),
    };
});
jest.mock('../simpleViewerUtils', () => ({
    setupScene: jest.fn(),
    cleanupScene: jest.fn(),
    updateSize: jest.fn(),
}));
describe('SimpleViewer', () => {
    beforeEach(() => {
        setupScene.mockReturnValue({
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(),
            renderer: new THREE.WebGLRenderer(),
            controls: { update: jest.fn() },
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('renders without crashing', () => {
        render(_jsx(SimpleViewer, { object: new THREE.Object3D() }));
    });
    test('calls setupScene and updates size on mount', () => {
        render(_jsx(SimpleViewer, { object: new THREE.Object3D() }));
        expect(setupScene).toHaveBeenCalled();
        expect(updateSize).toHaveBeenCalled();
    });
    test('adds resize event listener on mount and removes it on unmount', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        const { unmount } = render(_jsx(SimpleViewer, { object: new THREE.Object3D() }));
        expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        unmount();
    });
    test('calls cleanupScene on unmount', () => {
        const { unmount } = render(_jsx(SimpleViewer, { object: new THREE.Object3D() }));
        unmount();
        expect(cleanupScene).toHaveBeenCalled();
    });
});
