import * as THREE from 'three';
import {CameraOptions} from '../../types';

export const initializeCamera = (camera: THREE.Camera, cameraOptions: CameraOptions) => {
  // Set camera position
  if (cameraOptions.cameraPosition) {
    camera.position.copy(new THREE.Vector3().fromArray(cameraOptions.cameraPosition));
  }

  // Set camera target (look at point)
  if (cameraOptions.cameraTarget) {
    camera.lookAt(new THREE.Vector3().fromArray(cameraOptions.cameraTarget));
  }

  return camera;
};
