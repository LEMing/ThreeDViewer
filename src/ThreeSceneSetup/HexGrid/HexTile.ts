import * as THREE from 'three';

class HexTile {
  position: THREE.Vector3;
  size: number;
  color: string;

  constructor(position: THREE.Vector3, size: number, color: string) {
    this.position = position;
    this.size = size;
    this.color = color;
  }

  createMesh(): THREE.LineSegments {
    const geometry = new THREE.CircleGeometry(this.size, 6);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: this.color });
    const mesh = new THREE.LineSegments(edges, material);
    mesh.position.set(this.position.x, this.position.y, this.position.z);
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = Math.PI / 6;
    return mesh;
  }
}

export default HexTile;
