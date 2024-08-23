import * as THREE from 'three';

export const fitCameraToObject = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  cameraZ *= 1.4; // Add a bit of padding to the distance

  camera.position.set(center.x + cameraZ, center.y + cameraZ / 3, center.z + cameraZ / 5);
  camera.lookAt(center);

  camera.updateProjectionMatrix();
};
