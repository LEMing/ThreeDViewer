import * as THREE from 'three';
import {SimpleViewerOptions} from '../../types';
import {initializeRenderer} from './initializeRenderer';

export class RendererManager {
  public renderer: THREE.WebGLRenderer;
  private options: SimpleViewerOptions;

  constructor(options: SimpleViewerOptions) {
    this.options = options;
    this.renderer = initializeRenderer(options.renderer);
  }
}
