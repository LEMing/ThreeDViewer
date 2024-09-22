import * as THREE from 'three';
import { SimpleViewerOptions } from '../../types';
import { importRaytracer } from '../importRaytracer';

export class PathTracingManager {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private isPathTracing = false;
  ptRenderer: any = null;
  private renderCount: number = 0;  // Render pass counter
  private maxSamples: number;  // Maximum number of passes
  private _onComplete: (image: string) => void;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    options: SimpleViewerOptions,
    onComplete: (image: string) => void
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.maxSamples = options.maxSamplesPathTracing;
    this._onComplete = onComplete;
    this.setupPathTracer();
  }

  public setupPathTracer() {
    const { WebGLPathTracer } = importRaytracer();
    this.ptRenderer = new WebGLPathTracer(this.renderer);
    this.updatePathTracerRenderer();
  }

  public updatePathTracerRenderer() {
    this.ptRenderer.setScene(this.scene, this.camera);
    this.ptRenderer.renderToCanvas = true;

    // Update materials and lighting
    this.ptRenderer.updateMaterials();
    this.ptRenderer.updateLights();

    // If the scene contains an environment map, update it for the ray tracer
    if (this.scene.environment) {
      this.ptRenderer.updateEnvironment();
    }
  }

  set onComplete(value: (image: string) => void) {
    this._onComplete = value;
  }

  get onComplete() {
    return this._onComplete;
  }

  public startPathTracing() {
    if (!this.isPathTracing && this.ptRenderer) {
      this.isPathTracing = true;
      this.renderCount = 0;  // Reset the counter each time Path Tracing starts
      this.ptRenderer.reset(); // Reset the Path Tracer
      this.animatePathTracing();
    }
  }

  public stopPathTracing() {
    this.isPathTracing = false;
  }

  private animatePathTracing = () => {
    if (!this.isPathTracing || !this.ptRenderer) return;

    this.renderCount += 1;
    if (this.renderCount >= this.maxSamples) {
      this.stopPathTracing();
      console.log(`Path tracing completed after ${this.renderCount} samples.`);

      // Save the image
      this.saveScreenshot();
      return;
    }

    requestAnimationFrame(() => this.animatePathTracing());
    this.ptRenderer.renderSample();
  };

  public saveScreenshot() {
    const canvas = this.renderer.domElement;
    const dataUrl = canvas.toDataURL('image/png');
    this.onComplete(dataUrl);
  }

  // Method to reset and switch to standard rendering
  public resetForStandardRender() {
    this.isPathTracing = false;
    this.renderCount = 0;  // Reset the counter when switching to standard rendering
  }
}
