import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export type LoaderGLB = {
  load: (
    url: string,
    onLoad?: (gltf: any) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void) => void;
}

export interface SimpleViewerProps {
  object: THREE.Object3D | null; // Pass any Three.js object
  options?: SimpleViewerOptions;
}

export interface CameraOptions {
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cameraFov: number;
  cameraNear: number;
  cameraFar: number;
  autoFitToObject: boolean;
}

export interface RendererOptions {
  antialias: boolean;
  alpha: boolean;
  shadowMapEnabled: boolean;
  pixelRatio: number;
  shadowMapType: THREE.ShadowMapType;
  toneMapping?: THREE.ToneMapping;
  toneMappingExposure?: number;
}

export interface LightningOptions {
  ambientLight: {
    color: string;
    intensity: number;
  };
  hemisphereLight: {
    skyColor: string;
    groundColor: string;
    intensity: number;
  };
  directionalLight: {
    color: string;
    intensity: number;
    position: THREE.Vector3;
    castShadow: boolean;
    shadow: {
      mapSize: {
        width: number;
        height: number;
      };
      camera: {
        near: number;
        far: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
      };
      bias: number;
      radius: number;
    };
  };
}

export interface HelperOptions {
  gridHelper: boolean;
  axesHelper: boolean;
  object3DHelper: boolean;
}

export interface SimpleViewerOptions {
  staticScene: boolean;
  backgroundColor: string;
  camera: CameraOptions
  lightning: LightningOptions,
  renderer: RendererOptions,
  controls: {
    enabled: boolean;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    enableRotate: boolean;
    enablePan: boolean;
  }
  helpers: HelperOptions,
  threeBaseRefs: {
    scene: {current: THREE.Scene | null};
    camera: {current: THREE.PerspectiveCamera | null};
    renderer: {current: THREE.WebGLRenderer | null};
    controls: {current: OrbitControls | null};
    mountPoint: {current: HTMLDivElement | null}
  },
  animationLoop: ((time: number) => void) | null;
}
