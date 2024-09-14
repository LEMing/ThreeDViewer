// syncCameras.test.ts

import * as THREE from 'three';
import { syncGizmoCameraWithMain, syncMainCameraWithGizmo } from '../CameraController'; // Adjust the import path accordingly

describe('Camera Synchronization Functions', () => {
  let mainCamera: THREE.PerspectiveCamera;
  let gizmoCamera: THREE.PerspectiveCamera;

  beforeEach(() => {
    // Initialize the main camera
    mainCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    mainCamera.position.set(10, 20, 30);
    mainCamera.lookAt(0, 0, 0);
    mainCamera.updateMatrixWorld(true);

    // Initialize the gizmo camera
    gizmoCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    gizmoCamera.position.set(-10, -20, -30);
    gizmoCamera.lookAt(0, 0, 0);
    gizmoCamera.updateMatrixWorld(true);
  });

  test('syncGizmoCameraWithMain should synchronize gizmoCamera with mainCamera', () => {
    syncGizmoCameraWithMain(gizmoCamera, mainCamera);

    // The gizmoCamera should have its position adjusted correctly
    const mainDirection = new THREE.Vector3(0, 0, -1)
    .applyQuaternion(mainCamera.quaternion)
    .normalize();

    const expectedPosition = mainDirection.clone().multiplyScalar(-5);
    expect(gizmoCamera.position.distanceTo(expectedPosition)).toBeLessThan(1e-6);

    // The gizmoCamera should be looking at the origin
    const gizmoDirection = new THREE.Vector3();
    gizmoCamera.getWorldDirection(gizmoDirection);

    const expectedDirection = new THREE.Vector3()
    .subVectors(new THREE.Vector3(0, 0, 0), gizmoCamera.position)
    .normalize();

    expect(gizmoDirection.distanceTo(expectedDirection)).toBeLessThan(1e-6);
  });

  test('syncMainCameraWithGizmo should synchronize mainCamera with gizmoCamera', () => {
    syncMainCameraWithGizmo(mainCamera, gizmoCamera);

    // The mainCamera should have its position adjusted correctly
    const moveDistance = mainCamera.position.length();
    const gizmoDirection = new THREE.Vector3(0, 0, -1)
    .applyQuaternion(gizmoCamera.quaternion)
    .normalize();

    const expectedPosition = gizmoDirection.clone().multiplyScalar(-moveDistance);
    expect(mainCamera.position.distanceTo(expectedPosition)).toBeLessThan(1e-6);

    // The mainCamera should be looking at the origin
    const mainDirection = new THREE.Vector3();
    mainCamera.getWorldDirection(mainDirection);

    const expectedDirection = new THREE.Vector3()
    .subVectors(new THREE.Vector3(0, 0, 0), mainCamera.position)
    .normalize();

    expect(mainDirection.distanceTo(expectedDirection)).toBeLessThan(1e-6);
  });
});
