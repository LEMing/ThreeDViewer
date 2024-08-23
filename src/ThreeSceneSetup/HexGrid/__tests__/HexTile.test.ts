import * as THREE from 'three';
import { Vector3, CircleGeometry, EdgesGeometry, LineBasicMaterial, LineSegments } from 'three';
import HexTile from '../HexTile';

jest.mock('three');

describe('HexTile', () => {
  let mockVector3: jest.Mock<Vector3>;
  let mockCircleGeometry: jest.Mock<CircleGeometry>;
  let mockEdgesGeometry: jest.Mock<EdgesGeometry>;
  let mockLineBasicMaterial: jest.Mock<LineBasicMaterial>;
  let mockLineSegments: jest.Mock<LineSegments>;

  beforeEach(() => {
    mockVector3 = THREE.Vector3 as unknown as jest.Mock<Vector3>;
    mockCircleGeometry = THREE.CircleGeometry as unknown as jest.Mock<CircleGeometry>;
    mockEdgesGeometry = THREE.EdgesGeometry as unknown as jest.Mock<EdgesGeometry>;
    mockLineBasicMaterial = THREE.LineBasicMaterial as unknown as jest.Mock<LineBasicMaterial>;
    mockLineSegments = THREE.LineSegments as unknown as jest.Mock<LineSegments>;

    jest.clearAllMocks();
  });

  test('constructor should set position and size', () => {
    const position = new THREE.Vector3(1, 2, 3);
    const size = 5;
    const hexTile = new HexTile(position, size);

    expect(hexTile.position).toBe(position);
    expect(hexTile.size).toBe(size);
  });

  test('createMesh should create and return a LineSegments object', () => {
    const position = new THREE.Vector3(1, 2, 3);
    const size = 5;
    const hexTile = new HexTile(position, size);

    const mockMesh = {
      position: {
        set: jest.fn(),
      },
      rotation: {
        x: 0,
        z: 0,
      },
    };
    mockLineSegments.mockReturnValue(mockMesh as unknown as LineSegments);

    const result = hexTile.createMesh();

    expect(mockCircleGeometry).toHaveBeenCalledWith(size, 6);
    expect(mockEdgesGeometry).toHaveBeenCalled();
    expect(mockLineBasicMaterial).toHaveBeenCalledWith({ color: 0x333333 });
    expect(mockLineSegments).toHaveBeenCalled();

    expect(mockMesh.rotation.x).toBeCloseTo(Math.PI / 2);
    expect(mockMesh.rotation.z).toBeCloseTo(Math.PI / 6);

    expect(result).toBe(mockMesh);
  });
});
