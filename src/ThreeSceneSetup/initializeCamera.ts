import * as THREE from 'three';
import {CameraOptions} from '../types';

export const initializeCamera = (aspectRatio: number, cameraOptions: CameraOptions) => {

  const camera = new THREE.PerspectiveCamera(
    cameraOptions.cameraFov || 75,
    aspectRatio,
    cameraOptions.cameraNear || 0.1,
    cameraOptions.cameraFar || 100000
  );

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
