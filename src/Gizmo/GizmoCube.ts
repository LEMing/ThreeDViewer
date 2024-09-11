import * as THREE from 'three';

export const GizmoCube = (scene: THREE.Scene): THREE.Group => {
  const createTextTexture = (text: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    context!.fillStyle = '#93a5aa';
    context!.fillRect(0, 0, canvas.width, canvas.height);
    context!.font = '48px Arial';
    context!.fillStyle = '#000000';
    context!.textAlign = 'center';
    context!.textBaseline = 'middle';
    context!.fillText(text, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
  };

  // Материалы для сторон куба
  const materials = [
    new THREE.MeshStandardMaterial({ map: createTextTexture('RIGHT') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('LEFT') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('TOP') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('BOTTOM') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('FRONT') }),
    new THREE.MeshStandardMaterial({ map: createTextTexture('BACK') }),
  ];

  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cube = new THREE.Mesh(cubeGeometry, materials);

  const group = new THREE.Group();
  group.add(cube);

  const edges = new THREE.EdgesGeometry(cubeGeometry); // Геометрия рёбер
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Материал для рёбер
  const wireframe = new THREE.LineSegments(edges, lineMaterial); // Создаём рёбра как линии
  group.add(wireframe);

  scene.add(group);

  return group;
};
