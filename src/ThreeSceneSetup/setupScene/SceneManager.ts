import * as THREE from 'three';
import { SimpleViewerOptions } from '../../types';
import { importRaytracer } from '../importRaytracer';
import { CameraManager } from './CameraManager';
import { RendererManager } from './RendererManager';
import { ControlsManager } from './ControlsManager';
import { SceneInitializer } from '../SceneInitializer';
import { PathTracingManager } from './PathTracingManager';
import { AnimationManager } from './AnimationManager';
import { THREEBase } from '../types';

export class SceneManager {
  private mountRef;
  private sceneRef;
  private rendererRef;
  private cameraRef;
  private object;
  private options;
  private cameraManager: CameraManager;
  private rendererManager: RendererManager;
  private controlsManager: ControlsManager;
  private sceneInitializer: SceneInitializer;
  public readonly pathTracingManager: PathTracingManager | null;
  private animationManager: AnimationManager;

  constructor(
    threeBase: THREEBase,
    object: THREE.Object3D | null,
    options: SimpleViewerOptions,
    setRenderCompleteImage: (image: string | null) => void
  ) {
    const { mountRef, sceneRef, rendererRef, cameraRef } = threeBase;
    this.mountRef = mountRef;
    this.sceneRef = sceneRef;
    this.rendererRef = rendererRef;
    this.cameraRef = cameraRef;
    this.object = object;
    this.options = options;

    if (!this.mountRef.current) throw new Error('Mount div is not ready');

    this.cameraManager = new CameraManager(this.mountRef, this.options);
    this.rendererManager = new RendererManager(this.options);
    this.controlsManager = new ControlsManager(
      this.cameraManager.camera,
      this.rendererManager.renderer.domElement,
      this.options
    );
    this.sceneInitializer = new SceneInitializer(
      this.object,
      this.cameraManager.camera,
      this.controlsManager.controls,
      this.options,
      this.mountRef
    );

    this.rendererRef.current = this.rendererManager.renderer;
    this.cameraRef.current = this.cameraManager.camera;
    this.sceneRef.current = this.sceneInitializer.scene;

    this.loadEnvironmentMap();

    this.mountRef.current.appendChild(this.rendererManager.renderer.domElement);

    if (this.options.usePathTracing) {
      this.pathTracingManager = new PathTracingManager(
        this.rendererManager.renderer,
        this.sceneInitializer.scene,
        this.cameraManager.camera,
        this.options,
        setRenderCompleteImage
      );
    } else {
      this.pathTracingManager = null;
    }

    this.animationManager = new AnimationManager(
      this.rendererManager.renderer,
      this.sceneInitializer.scene,
      this.cameraManager.camera,
      this.controlsManager.controls,
      this.options,
      this.pathTracingManager
    );

    this.controlsManager.controls.addEventListener('start', () => {
      this.onStartRendering();
    });
    this.controlsManager.controls.addEventListener('end', () =>
      this.animationManager.stopRendering()
    );
  }

  public onStartRendering() {
    if (this.options.usePathTracing) {
      if (!this.pathTracingManager) throw new Error('Path Tracing Manager is not initialized');
      this.pathTracingManager.setupPathTracer();
    }
    this.animationManager.startRendering();
    if (this.options.usePathTracing) {
      this.pathTracingManager?.stopPathTracing();
    }
  }

  private loadEnvironmentMap() {
    const envMapUrl = this.options.envMapUrl;
    if (envMapUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        envMapUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;

          // If Path Tracing is enabled, use BlurredEnvMapGenerator
          if (this.options.usePathTracing && this.pathTracingManager) {
            const { BlurredEnvMapGenerator } = importRaytracer();
            const envMapGenerator = new BlurredEnvMapGenerator(this.rendererRef.current!);

            // Generate a blurred environment map
            const blurredEnvMap = envMapGenerator.generate(texture, 0.2); // The higher the value, the stronger the blur
            this.sceneRef.current!.environment = blurredEnvMap;
            this.sceneRef.current!.background = blurredEnvMap;
            // Update the environment in the Path Tracer
            this.pathTracingManager.ptRenderer.updateEnvironment();
          } else {
            // If Path Tracing is not enabled, simply use the standard environment map
            this.sceneRef.current!.environment = texture;
            this.sceneRef.current!.background = texture;
            // Forcefully update the render
            this.rendererRef.current!.render(this.sceneRef.current!, this.cameraRef.current!);
          }
        },
        undefined,
        (error) => {
          console.error('Error loading environment map:', error);
        }
      );
    }
  }

  public getSceneElements() {
    return {
      scene: this.sceneInitializer.scene,
      camera: this.cameraManager.camera,
      renderer: this.rendererManager.renderer,
      controls: this.controlsManager.controls,
      pathTracingManager: this.pathTracingManager,
    };
  }
}
