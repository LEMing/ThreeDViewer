import * as THREE from 'three';

interface CameraSyncParams {
  sourceCamera: THREE.Camera;
  targetCamera: THREE.Camera;
  distance?: number; // Optional: For setting specific distances for gizmo and main cameras
}

const syncCameras = ({ sourceCamera, targetCamera, distance }: CameraSyncParams) => {
  // Copy the quaternion (orientation) from source to target
  targetCamera.quaternion.copy(sourceCamera.quaternion);

  // Determine the direction the target camera is facing
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(targetCamera.quaternion).normalize();

  // Adjust the target camera's position based on the provided distance
  const moveDistance = distance ?? sourceCamera.position.length(); // Use distance or original distance
  targetCamera.position.copy(direction.multiplyScalar(-moveDistance));

  // Target camera always looks at the center of the scene
  targetCamera.lookAt(0, 0, 0);

  // Update the projection matrix
  targetCamera.updateMatrixWorld(true);
};

export const syncGizmoCameraWithMain = (gizmoCamera: THREE.Camera, mainCamera: THREE.Camera) => {
  syncCameras({ sourceCamera: mainCamera, targetCamera: gizmoCamera, distance: 5 });
};

export const syncMainCameraWithGizmo = (mainCamera: THREE.Camera, gizmoCamera: THREE.Camera) => {
  syncCameras({
    sourceCamera: gizmoCamera,
    targetCamera: mainCamera,
    distance: mainCamera.position.length()
  });
};
