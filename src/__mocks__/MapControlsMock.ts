import * as THREE from 'three';

export const MapControls = jest.fn().mockImplementation(() => ({
  enableDamping: false,
  dampingFactor: 0,
  enableZoom: false,
  update: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  target: new THREE.Vector3()
}));
