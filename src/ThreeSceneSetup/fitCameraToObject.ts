import * as THREE from 'three';
import {importRaytracer} from './importRaytracer';

const {PhysicalCamera} = importRaytracer();

export const fitCameraToObject = (
  scene: THREE.Scene,
  camera: THREE.Camera
) => {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const padding = 1.2; // Adjust padding as needed

  if (
    camera instanceof THREE.PerspectiveCamera ||
    camera instanceof PhysicalCamera
  ) {
    fitPerspectiveCamera(camera, size, center, padding);
  } else if (camera instanceof THREE.OrthographicCamera) {
    fitOrthographicCamera(camera, size, center, padding);
  } else {
    console.warn('Camera type not supported in fitCameraToObject');
  }
};

const fitPerspectiveCamera = (
  camera: THREE.PerspectiveCamera,
  size: THREE.Vector3,
  center: THREE.Vector3,
  padding: number
) => {
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = (camera.fov * Math.PI) / 180;
  let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2));

  cameraZ *= padding; // Add padding to the distance

  camera.position.set(center.x, center.y, center.z + cameraZ);
  camera.lookAt(center);

  camera.updateProjectionMatrix();
};

const fitOrthographicCamera = (
  camera: THREE.OrthographicCamera,
  size: THREE.Vector3,
  center: THREE.Vector3,
  padding: number
) => {
  const width = size.x * padding;
  const height = size.y * padding;

  camera.left = -width / 2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = -height / 2;

  // Position the camera along the Z-axis to include the object
  const cameraZ = center.z + size.z * padding;
  camera.position.set(center.x, center.y, cameraZ);
  camera.lookAt(center);

  camera.near = 0.1; // Adjust near plane as needed
  camera.far = cameraZ + size.z * padding;

  camera.updateProjectionMatrix();
};
