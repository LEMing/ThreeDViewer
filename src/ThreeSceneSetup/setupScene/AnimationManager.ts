// AnimationManager.ts
import * as THREE from 'three';
import { throttle } from 'lodash';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {MapControls} from 'three/examples/jsm/controls/MapControls';
import {SimpleViewerOptions} from '../../types';
import {PathTracingManager} from './PathTracingManager';

const TIME_PER_FRAME = 1000 / 60; // 60 FPS

export class AnimationManager {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private controls: OrbitControls | MapControls;
  private options: SimpleViewerOptions;
  private isSceneActive = false;
  private pathTracingManager: PathTracingManager | null;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    controls: OrbitControls | MapControls,
    options: SimpleViewerOptions,
    pathTracingManager: PathTracingManager | null
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.options = options;
    this.pathTracingManager = pathTracingManager;
    this.handleRendering();
  }

  private throttledRender = throttle(() => {
    if (this.isSceneActive || !this.options.staticScene) {
      this.renderer.render(this.scene, this.camera);
    }
  }, TIME_PER_FRAME);

  private animate = (time: number) => {
    if (!this.isSceneActive && this.options.staticScene) return;

    requestAnimationFrame(this.animate);
    if (this.options.animationLoop) {
      this.options.animationLoop(time);
    }
    this.controls.update();

    if (this.options.usePathTracing && this.pathTracingManager?.ptRenderer) {
      // @ts-ignore
      this.pathTracingManager.ptRenderer.updateCamera();
    }
    this.renderer.shadowMap.needsUpdate = true;

    this.throttledRender();
  };

  private handleRendering() {
    this.animate(performance.now());

    if (this.options.usePathTracing) {
      this.pathTracingManager?.startPathTracing();
    }
  }

  public startRendering() {
    if (!this.isSceneActive) {
      this.isSceneActive = true;
      if (this.options.usePathTracing) {
        this.pathTracingManager?.stopPathTracing();
      }
      this.animate(performance.now());
    }
  }

  public stopRendering() {
    this.isSceneActive = false;
    if (this.options.usePathTracing) {
      this.pathTracingManager?.startPathTracing();
    }
  }
}
