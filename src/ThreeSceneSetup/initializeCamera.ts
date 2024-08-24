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
    camera.position.copy(cameraOptions.cameraPosition);
  }

  // Set camera target (look at point)
  if (cameraOptions.cameraTarget) {
    camera.lookAt(cameraOptions.cameraTarget);
  }

  return camera;
};
