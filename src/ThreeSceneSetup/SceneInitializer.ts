// SceneInitializer.ts
import * as THREE from 'three';
import {MapControls} from 'three/examples/jsm/controls/MapControls';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {SimpleViewerOptions} from '../types';
import {addHelpers} from './addHelpers';
import {addLighting} from './addLighting';
import {createGradientBackground} from './createGradientBackground';
import {fitCameraToObject} from './fitCameraToObject';
import {initializeScene} from './initializeScene';

export class SceneInitializer {
  public scene: THREE.Scene;
  private object: THREE.Object3D | null;
  private camera: THREE.Camera;
  private controls: OrbitControls | MapControls;
  private options: SimpleViewerOptions;
  private mountRef: React.RefObject<HTMLDivElement>;

  constructor(
    object: THREE.Object3D | null,
    camera: THREE.Camera,
    controls: OrbitControls | MapControls,
    options: SimpleViewerOptions,
    mountRef: React.RefObject<HTMLDivElement>
  ) {
    this.object = object;
    this.camera = camera;
    this.controls = controls;
    this.options = options;
    this.mountRef = mountRef;
    this.scene = initializeScene(options);
    this.setupScene();
  }

  private setupScene() {
    if (!this.mountRef.current) throw new Error('Mount div is not ready');

    const width = this.mountRef.current.clientWidth;
    const height = this.mountRef.current.clientHeight;
    const size = new THREE.Vector2(width * 3, height * 3);

    if (this.options.helpers.studioEnvironment) {
      createGradientBackground(this.scene, size);
    }

    this.setupObjectInScene();

    addLighting(this.scene, this.options.lightning);
    addHelpers(this.scene, this.object, this.options.helpers);

    if (this.options.camera.autoFitToObject) {
      fitCameraToObject(this.scene, this.camera);
    }

    const center = new THREE.Vector3();
    this.scene.position.copy(center);
    this.controls.target.copy(center);
    this.controls.update();
  }

  private async setupObjectInScene() {
    if (this.object) {
      this.object.castShadow = true;
      this.object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.scene.add(this.object);
    }
  }
}
