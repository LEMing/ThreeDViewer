import { render } from '@testing-library/react';
import * as THREE from 'three';
import {mockRenderer} from '../__mocks__/mockRenderer';
import { cleanupScene } from '../ThreeSceneSetup/cleanupScene';
import { SceneManager } from '../ThreeSceneSetup/setupScene/SceneManager';
import SimpleViewer from '../SimpleViewer';
jest.mock('threedgizmo', () => ({
  Gizmo: () => null,
}));
jest.mock('../ThreeSceneSetup/importRaytracer', () => {
  return {
    importRaytracer: () => {
      return {
        WebGLPathTracer: jest.fn(),
        PhysicalCamera: jest.fn(),
        BlurredEnvMapGenerator: jest.fn(),
      };
    },
  };
});

jest.mock('../ThreeSceneSetup/cleanupScene', () => ({
  cleanupScene: jest.fn(),
}));

const mockCanvas = document.createElement('canvas');

jest.mock('threedgizmo');

jest.mock('../ThreeSceneSetup/setupScene/SceneManager', () => {
  return {
    SceneManager: jest.fn().mockImplementation(() => {
      return {
        getSceneElements: jest.fn().mockReturnValue({
          scene: new THREE.Scene(),
          camera: new THREE.PerspectiveCamera(),
          renderer: mockRenderer,
          controls: { update: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn() },
        }),
      };
    }),
  };
});

describe('SimpleViewer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<SimpleViewer object={new THREE.Object3D()} />);
  });

  test('calls setupScene and updates size on mount', () => {
    render(<SimpleViewer object={new THREE.Object3D()} />);

    expect(SceneManager).toHaveBeenCalled();
  });

  test('adds resize event listener on mount and removes it on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const { unmount } = render(<SimpleViewer object={new THREE.Object3D()} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    unmount();
  });

  test('calls cleanupScene on unmount', () => {
    const { unmount } = render(<SimpleViewer object={new THREE.Object3D()} />);
    unmount();
    expect(cleanupScene).toHaveBeenCalled();
  });
});
