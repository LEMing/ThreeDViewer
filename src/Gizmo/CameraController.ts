
import * as THREE from 'three';
let isSyncing = false;

export const syncCubeWithCamera = (
  cube: THREE.Group | null,
  camera: THREE.PerspectiveCamera,
  render: () => void
) => {
  if (!cube || !camera || isSyncing) return;

  isSyncing = true;

  // Используем requestAnimationFrame для задержки
  requestAnimationFrame(() => {
    // Копируем кватернион камеры в куб (без изменения позиции камеры)
    cube.quaternion.copy(camera.quaternion);
    console.log('AAAAAAAAAAAAAAAAAA');

    // Обновляем сцену
    render();
    isSyncing = false;
  });
};

export const syncCameraWithCube = (
  cube: THREE.Group | null,
  camera: THREE.PerspectiveCamera,
  render: () => void
) => {
  if (!cube || !camera || isSyncing) return;

  isSyncing = true;

  requestAnimationFrame(() => {
    // Копируем кватернион куба в камеру
    camera.quaternion.copy(cube.quaternion);

    const distanceFromCenter = camera.position.length();
    // Устанавливаем позицию камеры относительно вращения
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    camera.position.copy(direction.multiplyScalar(distanceFromCenter));

    // Камера всегда должна смотреть на центр сцены
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    console.log('syncCameraWithCube');

    // Обновляем сцену
    render();
    isSyncing = false;
  });
};
