import * as THREE from 'three';
import {LightningOptions} from '../types';

export const addLighting = (scene: THREE.Scene, options: LightningOptions = defaultLightningOptions) => {
  // Ambient Light
  const ambientLight = new THREE.AmbientLight(
    options.ambientLight.color,
    options.ambientLight.intensity
  );
  scene.add(ambientLight);

  // Hemisphere Light
  const hemisphereLight = new THREE.HemisphereLight(
    options.hemisphereLight.skyColor,
    options.hemisphereLight.groundColor,
    options.hemisphereLight.intensity
  );
  scene.add(hemisphereLight);

  // Directional Light
  const directionalLight = new THREE.DirectionalLight(
    options.directionalLight.color,
    options.directionalLight.intensity
  );
  directionalLight.position.copy(options.directionalLight.position);

  // Shadow settings
  directionalLight.castShadow = options.directionalLight.castShadow;

  if (directionalLight.castShadow) {
    directionalLight.shadow.mapSize.width = options.directionalLight.shadow.mapSize.width;
    directionalLight.shadow.mapSize.height = options.directionalLight.shadow.mapSize.height;

    directionalLight.shadow.camera.near = options.directionalLight.shadow.camera.near;
    directionalLight.shadow.camera.far = options.directionalLight.shadow.camera.far;
    directionalLight.shadow.camera.left = options.directionalLight.shadow.camera.left;
    directionalLight.shadow.camera.right = options.directionalLight.shadow.camera.right;
    directionalLight.shadow.camera.top = options.directionalLight.shadow.camera.top;
    directionalLight.shadow.camera.bottom = options.directionalLight.shadow.camera.bottom;

    directionalLight.shadow.bias = options.directionalLight.shadow.bias;
    directionalLight.shadow.radius = options.directionalLight.shadow.radius;
  }

  scene.add(directionalLight);
};

export const defaultLightningOptions = {
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
        width: 512,
        height: 512,
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
};

export default defaultLightningOptions;
