import * as THREE from 'three';
import HexTile from '../HexTile';


describe('HexTile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('constructor should set position and size', () => {
    const position = new THREE.Vector3(1, 2, 3);
    const size = 5;
    const hexTile = new HexTile(position, size, '0xFFFFFF');

    expect(hexTile.position).toBe(position);
    expect(hexTile.size).toBe(size);
  });

  test('createMesh should create and return a LineSegments object', () => {
    const position = new THREE.Vector3(1, 2, 3);
    const size = 5;
    const hexTile = new HexTile(position, size, '#FFFFFF');
    const result = hexTile.createMesh();

    expect(result.rotation.x).toBeCloseTo(Math.PI / 2);
    expect(result.rotation.z).toBeCloseTo(Math.PI / 6);

  });
});
