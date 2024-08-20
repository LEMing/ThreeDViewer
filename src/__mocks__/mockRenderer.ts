import * as THREE from 'three';


// eslint-disable-next-line import/namespace
class renderer implements THREE.Renderer {
  domElement: HTMLCanvasElement;
  public shadowMap: {
    enabled: boolean;
  };
  constructor() {
    this.domElement = document.createElement('canvas');
    this.shadowMap = {
      enabled: false,
    };
  }
  getSize() {
    return {
      width: 0,
      height: 0,
    };
  }
  setPixelRatio() {
    // do nothing
  }
  render() {
    // do nothing
  }
  getPixelRatio() {
    return window.devicePixelRatio;
  }
  setSize() {
    // do nothing
  }
}
export const mockRenderer = new renderer();
