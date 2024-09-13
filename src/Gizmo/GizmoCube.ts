import * as THREE from 'three';

export const GizmoCube = (scene: THREE.Scene): THREE.Group => {
  // Function to create texture with text on a canvas
  const createTextTexture = (text: string) => {
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

  // Materials for each face of the cube, with labeled textures
  const materials = [
    new THREE.MeshStandardMaterial({ map: createTextTexture('RIGHT') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('LEFT') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('TOP') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('BOTTOM') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('FRONT') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('BACK') }),
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

  // Add the group to the scene
  scene.add(group);

  return group;
};
