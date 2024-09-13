import {render} from '@testing-library/react';
import * as THREE from 'three';
import {cleanupScene} from '../ThreeSceneSetup/cleanupScene';
import {setupScene} from '../ThreeSceneSetup/setupScene';
import {updateSize} from '../ThreeSceneSetup/updateSize';

import SimpleViewer from '../SimpleViewer';


const mockCanvas = document.createElement('canvas');
jest.mock('three', () => {
  const originalThree = jest.requireActual('three');
  return {
    ...originalThree,
    WebGLRenderer: jest.fn(() => ({
      setPixelRatio: jest.fn(),
      shadowMap: {enabled: true},
      setSize: jest.fn(),
      getSize: jest.fn(() => ({width: 800, height: 600})),
      domElement: mockCanvas,
      render: jest.fn(),
    })),
  };
});

jest.mock('../ThreeSceneSetup/setupScene');
jest.mock('../ThreeSceneSetup/cleanupScene');
jest.mock('../ThreeSceneSetup/updateSize');
jest.mock('../Gizmo/getWebGLRenderer');

describe('SimpleViewer', () => {
  beforeEach(() => {
    (setupScene as jest.Mock).mockReturnValue({
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(),
      renderer: new THREE.WebGLRenderer(),
      controls: {update: jest.fn()},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<SimpleViewer object={new THREE.Object3D()} />);
  });

  test('calls setupScene and updates size on mount', () => {
    render(<SimpleViewer object={new THREE.Object3D()} />);

    expect(setupScene).toHaveBeenCalled();
    expect(updateSize).toHaveBeenCalled();
  });

  test('adds resize event listener on mount and removes it on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const {unmount} = render(<SimpleViewer object={new THREE.Object3D()} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    unmount();
  });

  test('calls cleanupScene on unmount', () => {
    const {unmount} = render(<SimpleViewer object={new THREE.Object3D()} />);
    unmount();
    expect(cleanupScene).toHaveBeenCalled();
  });
});
