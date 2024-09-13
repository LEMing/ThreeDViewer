
import * as THREE from 'three';
let isSyncing = false;

export const syncCubeWithCamera = async (
  cube: THREE.Group,
  camera: THREE.PerspectiveCamera,
  gizmoRender: () => void
) => {
  if (isSyncing) return;

  isSyncing = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      // Копируем кватернион камеры в куб

      cube.quaternion.copy(camera.quaternion);

      // Обновляем сцену
      cube.updateMatrixWorld(true);

      gizmoRender();
      isSyncing = false;
      resolve(true);
    },1);
  });
};

export const syncCameraWithCube = (
  cube: THREE.Group | null,
  camera: THREE.PerspectiveCamera,
  render: () => void
) => {
  if (!cube || !camera || isSyncing) return;

  isSyncing = true;

  return new Promise((resolve) => {
    setTimeout(() => {
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
      resolve(true);
    },1);
  });

};
