import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import {ControlType, SimpleViewerOptions} from '../../types';

export class ControlsManager {
  public controls: OrbitControls | MapControls;
  private camera: THREE.Camera;
  private rendererDomElement: HTMLCanvasElement;
  private options: SimpleViewerOptions;

  constructor(
    camera: THREE.Camera,
    rendererDomElement: HTMLCanvasElement,
    options: SimpleViewerOptions
  ) {
    this.camera = camera;
    this.rendererDomElement = rendererDomElement;
    this.options = options;
    this.controls = this.setupControls();
  }

  private setupControls() {
    const controls =
      this.options.controls.type === ControlType.MapsControls
        ? new MapControls(this.camera, this.rendererDomElement)
        : new OrbitControls(this.camera, this.rendererDomElement);

    Object.assign(controls, this.options.controls);
    controls.update();

    return controls;
  }
}
