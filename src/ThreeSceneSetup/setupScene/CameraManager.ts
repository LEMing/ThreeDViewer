import * as THREE from 'three';
import {SimpleViewerOptions} from '../../types';
import {importRaytracer} from '../importRaytracer';
import {initializeCamera} from './initializeCamera';

export class CameraManager {
  private mountRef: React.RefObject<HTMLDivElement>;
  private options: SimpleViewerOptions;
  public camera: THREE.Camera;

  constructor(mountRef: React.RefObject<HTMLDivElement>, options: SimpleViewerOptions) {
    this.mountRef = mountRef;
    this.options = options;
    this.camera = this.setupCamera();
  }

  private setupCamera(): THREE.Camera {
    let camera;
    if (!this.mountRef.current) throw new Error('Mount div is not ready');
    const aspectRatio = this.mountRef.current.clientWidth / this.mountRef.current.clientHeight;

    if (this.options.usePathTracing) {
      const {PhysicalCamera} = importRaytracer();
      camera = new PhysicalCamera(
        this.options.camera.cameraFov,
        aspectRatio,
        this.options.camera.cameraNear,
        this.options.camera.cameraFar
      );
      camera.fStop = 1.4; // Aperture settings for depth of field effect
    } else {
      camera = new THREE.PerspectiveCamera(
        this.options.camera.cameraFov,
        aspectRatio,
        this.options.camera.cameraNear,
        this.options.camera.cameraFar
      );
    }
    initializeCamera(camera, this.options.camera);
    return camera;
  }
}
