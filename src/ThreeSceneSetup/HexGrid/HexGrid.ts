import * as THREE from 'three';
import HexTile from './HexTile';

class HexGrid {
  radius: number;
  tileSize: number;

  constructor(radius: number, tileSize: number) {
    this.radius = radius;
    this.tileSize = tileSize;
  }

  generateGrid(): HexTile[] {
    const hexTiles: HexTile[] = [];
    const width = Math.sqrt(3) * this.tileSize;  // Горизонтальное расстояние между центрами шестиугольников
    const height = 2 * this.tileSize;            // Вертикальное расстояние между центрами шестиугольников

    for (let q = -this.radius; q <= this.radius; q++) {
      const r1 = Math.max(-this.radius, -q - this.radius);
      const r2 = Math.min(this.radius, -q + this.radius);
      for (let r = r1; r <= r2; r++) {
        const x = width * (q + r / 2);
        const z = height * 0.75 * r;
        const tile = new HexTile(new THREE.Vector3(x, -0.1, z), this.tileSize);
        hexTiles.push(tile);
      }
    }

    return hexTiles;
  }

  addToScene(scene: THREE.Scene): void {
    const hexTiles = this.generateGrid();
    hexTiles.forEach(tile => {
      const mesh = tile.createMesh();
      scene.add(mesh);
    });
  }
}

export default HexGrid;
