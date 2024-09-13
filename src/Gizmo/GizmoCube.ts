import * as THREE from 'three';

export class GizmoCube {
  // Function to create texture with text on a canvas
  private createTextTexture(text: string) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;

    // Set background color for the canvas
    context!.fillStyle = '#93a5aa';
    context!.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties and draw text on the canvas
    context!.font = '48px Arial';
    context!.fillStyle = '#000000';
    context!.textAlign = 'center';
    context!.textBaseline = 'middle';
    context!.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
  };

  private _create() {
    const materials = [
      new THREE.MeshStandardMaterial({ map: this.createTextTexture('RIGHT') }),
      new THREE.MeshStandardMaterial({ map: this.createTextTexture('LEFT') }),
      new THREE.MeshStandardMaterial({ map: this.createTextTexture('TOP') }),
      new THREE.MeshStandardMaterial({ map: this.createTextTexture('BOTTOM') }),
      new THREE.MeshStandardMaterial({ map: this.createTextTexture('FRONT') }),
      new THREE.MeshStandardMaterial({ map: this.createTextTexture('BACK') }),
    ];

    // Create cube geometry and assign the materials to it
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(cubeGeometry, materials);

    // Group to contain both the cube and its wireframe
    const group = new THREE.Group();
    group.add(cube);

    // Create wireframe for the cube's edges
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    group.add(wireframe);
    return group;
  }

  public create() {
    return this._create();
  }

}
