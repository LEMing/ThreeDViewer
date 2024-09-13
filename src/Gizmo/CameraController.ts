
import * as THREE from 'three';

export const syncGizmoCameraWithMain = (gizmoCamera: THREE.PerspectiveCamera, camera: THREE.PerspectiveCamera) => {
  // Копируем ориентацию основной камеры в гизмо-камеру
  gizmoCamera.quaternion.copy(camera.quaternion);

  // Определяем направление, в котором смотрит гизмо-камера
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(gizmoCamera.quaternion).normalize();

  // Устанавливаем позицию гизмо-камеры на фиксированное расстояние от центра
  gizmoCamera.position.copy(direction.multiplyScalar(5).negate()); // Смещаем по направлению взгляда

  gizmoCamera.lookAt(0, 0, 0); // Гизмо-камера всегда смотрит на центр сцены
  gizmoCamera.updateProjectionMatrix(); // Обновляем матрицу проекции
};

export const syncMainCameraWithGizmo = (
  camera: THREE.PerspectiveCamera,
  gizmoCamera: THREE.PerspectiveCamera
) => {
  // Вычисляем расстояние от камеры до центра сцены
  const originalDistance = camera.position.length(); // Расстояние до (0, 0, 0)

  // Копируем ориентацию гизмо-камеры в основную камеру
  camera.quaternion.copy(gizmoCamera.quaternion);

  // Определяем направление, в котором смотрит основная камера
  const direction = new THREE.Vector3(0, 0, -1)
  .applyQuaternion(camera.quaternion)
  .normalize();

  // Устанавливаем позицию основной камеры на исходное расстояние от центра сцены
  camera.position.copy(direction.multiplyScalar(-originalDistance)); // Смещаем по направлению взгляда

  camera.lookAt(0, 0, 0); // Основная камера всегда смотрит на центр сцены
  camera.updateProjectionMatrix(); // Обновляем матрицу проекции
};
