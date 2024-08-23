import * as THREE from 'three';
import { Vector3, Scene } from 'three';
import HexGrid from '../HexGrid';
import HexTile from '../HexTile';

jest.mock('three');
jest.mock('../HexTile');

describe('HexGrid', () => {
  let mockVector3: jest.Mock<Vector3>;
  let mockScene: jest.Mock<Scene>;

  beforeEach(() => {
    mockVector3 = THREE.Vector3 as unknown as jest.Mock<Vector3>;
    mockScene = THREE.Scene as unknown as jest.Mock<Scene>;
    (HexTile as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  test('constructor should set radius and tileSize', () => {
    const grid = new HexGrid(3, 1);
    expect(grid.radius).toBe(3);
    expect(grid.tileSize).toBe(1);
  });

  test('generateGrid should create correct number of tiles', () => {
    const grid = new HexGrid(1, 1);
    const tiles = grid.generateGrid();
    expect(tiles.length).toBe(7); // For radius 1, we expect 7 tiles
  });

  test('generateGrid should create HexTile instances with correct positions', () => {
    const grid = new HexGrid(1, 1);
    grid.generateGrid();

    // Check if HexTile was called with correct positions
    expect(HexTile).toHaveBeenCalledTimes(7);
    expect(HexTile).toHaveBeenCalledWith(expect.any(THREE.Vector3), 1);
  });

  test('addToScene should add tiles to the scene', () => {
    const grid = new HexGrid(1, 1);
    const mockSceneInstance = {
      add: jest.fn()
    };
    const mockMesh = { /* mock properties */ };
    (HexTile as jest.Mock).mockImplementation(() => ({
      createMesh: jest.fn().mockReturnValue(mockMesh)
    }));

    grid.addToScene(mockSceneInstance as unknown as THREE.Scene);

    expect(mockSceneInstance.add).toHaveBeenCalledTimes(7);
    expect(mockSceneInstance.add).toHaveBeenCalledWith(mockMesh);
  });
});
