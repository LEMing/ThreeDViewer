import * as THREE from 'three';
import { syncCameraWithCube } from './CameraController';

export const setupEventHandlers = (
  cube: THREE.Group | null,
  camera: THREE.PerspectiveCamera | null,
  render: () => void
) => {
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  const onMouseDown = (event: MouseEvent) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
    console.log('Dragging started');
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isDragging || !cube || !camera) return;

    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };

    previousMousePosition = { x: event.clientX, y: event.clientY };

    const rotationSpeed = 0.005;
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(deltaMove.y * rotationSpeed, deltaMove.x * rotationSpeed, 0, 'XYZ'));
    cube.quaternion.multiplyQuaternions(quaternion, cube.quaternion);

    syncCameraWithCube(cube, camera, render);
  };

  const onMouseUp = () => {
    isDragging = false;
    console.log('Dragging stopped');
  };

  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  return () => {
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };
};
