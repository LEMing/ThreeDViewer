// imports
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { addLighting } from './addLighting';
import { GizmoCube } from './GizmoCube';

interface GizmoParams {
  gizmoDiv: HTMLDivElement;
  gizmoScene: THREE.Scene;
  gizmoRenderer: THREE.WebGLRenderer;
  gizmoCamera: THREE.PerspectiveCamera;
}

interface MainParams {
  mainCamera: THREE.Camera;
  mainControls: OrbitControls;
  renderGizmo: () => void;
}

interface SyncFunctions {
  syncGizmoCameraWithMain: (gizmoCamera: THREE.Camera, mainCamera: THREE.Camera) => void;
  syncMainCameraWithGizmo: (mainCamera: THREE.Camera, gizmoCamera: THREE.Camera) => void;
}

interface GizmoControlParams {
  gizmoParams: GizmoParams;
  mainParams: MainParams;
  syncFunctions: SyncFunctions;
}

class GizmoControl {
  private gizmoDiv: HTMLDivElement;
  private gizmoScene: THREE.Scene;
  private gizmoRenderer: THREE.WebGLRenderer;
  private gizmoCamera: THREE.PerspectiveCamera;
  private mainCamera: THREE.Camera;
  private mainControls: OrbitControls;
  private renderGizmo: () => void;
  private gizmoControls: OrbitControls;
  private onChangeMainControlsListener: () => void = () => {};
  private onChangeGizmoControlsListener: () => void = () => {};
  private animationId: number = 0;
  private syncFunctions: SyncFunctions;

  constructor(params: GizmoControlParams) {
    const { gizmoParams, mainParams, syncFunctions } = params;

    this.gizmoDiv = gizmoParams.gizmoDiv;
    this.gizmoScene = gizmoParams.gizmoScene;
    this.gizmoRenderer = gizmoParams.gizmoRenderer;
    this.gizmoCamera = gizmoParams.gizmoCamera;
    this.mainCamera = mainParams.mainCamera;
    this.mainControls = mainParams.mainControls;
    this.renderGizmo = mainParams.renderGizmo;
    this.syncFunctions = syncFunctions;
    this.gizmoControls = new OrbitControls(this.gizmoCamera, this.gizmoRenderer.domElement);

    this.initializeRenderer();
    this.initializeScene();
    this.initializeControls();
    this.startAnimationLoop();
  }

  private initializeRenderer() {
    this.gizmoRenderer.setPixelRatio(window.devicePixelRatio);
    this.gizmoRenderer.setSize(100, 100);
    this.gizmoDiv.appendChild(this.gizmoRenderer.domElement);
  }

  private initializeScene() {
    const gizmoCube = new GizmoCube().create();
    this.gizmoScene.add(gizmoCube);
    addLighting(this.gizmoScene);
  }

  private initializeControls() {
    this.onChangeMainControlsListener = () =>
      this.syncFunctions.syncGizmoCameraWithMain(this.gizmoCamera, this.mainCamera);
    this.mainControls.addEventListener('change', this.onChangeMainControlsListener);

    this.gizmoControls.enableZoom = false;
    this.gizmoControls.update();

    this.onChangeGizmoControlsListener = () => {
      this.syncFunctions.syncMainCameraWithGizmo(this.mainCamera, this.gizmoCamera);
      this.renderGizmo();
    };
    this.gizmoControls.addEventListener('change', this.onChangeGizmoControlsListener);
  }

  private startAnimationLoop() {
    const render = () => {
      this.gizmoRenderer.render(this.gizmoScene, this.gizmoCamera);
    };

    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      render();
    };
    animate();
  }

  public dispose() {
    this.mainControls.removeEventListener('change', this.onChangeMainControlsListener);
    this.gizmoControls.removeEventListener('change', this.onChangeGizmoControlsListener);
    this.gizmoScene.clear();
    cancelAnimationFrame(this.animationId);
  }
}

export default GizmoControl;
