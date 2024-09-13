import * as THREE from 'three';
import { SimpleViewerOptions } from './types'; // Assuming you have a types file

const defaultOptions: SimpleViewerOptions = {
  staticScene: true, // It stops animation loop if there is no interactions
  backgroundColor: '#f0f0f7', // From BACKGROUND_COLOR constant
  camera: {
    cameraPosition: [2, 6, 2],
    cameraTarget: [0, 0, 0], // Center of the scene
    cameraFov: 75, // From initializeCamera
    cameraNear: 0.1, // From initializeCamera
    cameraFar: 100000, // From initializeCamera
    autoFitToObject: true,
  },
  lightning: {
    ambientLight: {
      color: '#404040',
      intensity: Math.PI,
    },
    hemisphereLight: {
      skyColor: '#ffffbb',
      groundColor: '#080820',
      intensity: 1,
    },
    directionalLight: {
      color: '#ffffff',
      intensity: Math.PI,
      position: new THREE.Vector3(6, 6, 6),
      castShadow: true,
      shadow: {
        mapSize: {
          width: 4096,
          height: 4096,
        },
        camera: {
          near: 0.5,
          far: 50,
          left: -10,
          right: 10,
          top: 10,
          bottom: -10,
        },
        bias: -0.001,
        radius: 1,
      },
    },
  },
  renderer: {
    antialias: true,
    alpha: false,
    shadowMapEnabled: true,
    pixelRatio: window.devicePixelRatio,
    shadowMapType: THREE.VSMShadowMap,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1,
  },
  controls: {
    enabled: true, // Controls are used in setupScene
    enableDamping: true, // From setupScene
    dampingFactor: 0.25, // From setupScene
    enableZoom: true, // From setupScene
    enableRotate: true, // Default for OrbitControls
    enablePan: true, // Default for OrbitControls
  },
  helpers: {
    gridHelper: true,
    color: '#333333',
    axesHelper: false,
    object3DHelper: false,
    addGizmo: false,
  },
  threeBaseRefs: {
    mountPoint: {current: null},
    scene: { current: null },
    camera: { current: null },
    renderer: { current: null },
    controls: { current: null },
  },
  animationLoop: null,
};

export default defaultOptions;
