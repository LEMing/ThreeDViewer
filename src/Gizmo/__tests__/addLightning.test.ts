
import * as THREE from 'three';
import { addLighting, defaultLightningOptions } from '../addLighting';

describe('addLighting', () => {
  let scene: THREE.Scene;

  beforeEach(() => {
    scene = new THREE.Scene();
  });

  test('should add default lights to the scene when no options are provided', () => {
    addLighting(scene);

    // Ambient Light
    const ambientLight = scene.children.find(
      (child) => child instanceof THREE.AmbientLight
    ) as THREE.AmbientLight;

    expect(ambientLight).toBeDefined();
    expect(ambientLight.color.getHex()).toBe(
      new THREE.Color(defaultLightningOptions.ambientLight.color).getHex()
    );
    expect(ambientLight.intensity).toBe(
      defaultLightningOptions.ambientLight.intensity
    );

    // Hemisphere Light
    const hemisphereLight = scene.children.find(
      (child) => child instanceof THREE.HemisphereLight
    ) as THREE.HemisphereLight;

    expect(hemisphereLight).toBeDefined();

    expect(hemisphereLight.groundColor.getHex()).toBe(
      new THREE.Color(defaultLightningOptions.hemisphereLight.groundColor).getHex()
    );
    expect(hemisphereLight.intensity).toBe(
      defaultLightningOptions.hemisphereLight.intensity
    );

    // Directional Light
    const directionalLight = scene.children.find(
      (child) => child instanceof THREE.DirectionalLight
    ) as THREE.DirectionalLight;

    expect(directionalLight).toBeDefined();
    expect(directionalLight.color.getHex()).toBe(
      new THREE.Color(defaultLightningOptions.directionalLight.color).getHex()
    );
    expect(directionalLight.intensity).toBe(
      defaultLightningOptions.directionalLight.intensity
    );
    expect(
      directionalLight.position.equals(
        defaultLightningOptions.directionalLight.position
      )
    ).toBe(true);
    expect(directionalLight.castShadow).toBe(
      defaultLightningOptions.directionalLight.castShadow
    );

    if (directionalLight.castShadow) {
      expect(directionalLight.shadow.mapSize.width).toBe(
        defaultLightningOptions.directionalLight.shadow.mapSize.width
      );
      expect(directionalLight.shadow.mapSize.height).toBe(
        defaultLightningOptions.directionalLight.shadow.mapSize.height
      );

      expect(directionalLight.shadow.camera.near).toBe(
        defaultLightningOptions.directionalLight.shadow.camera.near
      );
      expect(directionalLight.shadow.camera.far).toBe(
        defaultLightningOptions.directionalLight.shadow.camera.far
      );
      expect(directionalLight.shadow.camera.left).toBe(
        defaultLightningOptions.directionalLight.shadow.camera.left
      );
      expect(directionalLight.shadow.camera.right).toBe(
        defaultLightningOptions.directionalLight.shadow.camera.right
      );
      expect(directionalLight.shadow.camera.top).toBe(
        defaultLightningOptions.directionalLight.shadow.camera.top
      );
      expect(directionalLight.shadow.camera.bottom).toBe(
        defaultLightningOptions.directionalLight.shadow.camera.bottom
      );

      expect(directionalLight.shadow.bias).toBe(
        defaultLightningOptions.directionalLight.shadow.bias
      );
      expect(directionalLight.shadow.radius).toBe(
        defaultLightningOptions.directionalLight.shadow.radius
      );
    }
  });

  test('should add lights to the scene with provided options', () => {
    const options = {
      ambientLight: {
        color: '#000000',
        intensity: 0.5,
      },
      hemisphereLight: {
        skyColor: '#ff0000',
        groundColor: '#00ff00',
        intensity: 2,
      },
      directionalLight: {
        color: '#0000ff',
        intensity: 1,
        position: new THREE.Vector3(1, 1, 1),
        castShadow: false,
        shadow: {
          mapSize: {
            width: 256,
            height: 256,
          },
          camera: {
            near: 1,
            far: 100,
            left: -5,
            right: 5,
            top: 5,
            bottom: -5,
          },
          bias: -0.002,
          radius: 0.5,
        },
      },
    };

    addLighting(scene, options);

    // Ambient Light
    const ambientLight = scene.children.find(
      (child) => child instanceof THREE.AmbientLight
    ) as THREE.AmbientLight;

    expect(ambientLight).toBeDefined();
    expect(ambientLight.color.getHex()).toBe(
      new THREE.Color(options.ambientLight.color).getHex()
    );
    expect(ambientLight.intensity).toBe(options.ambientLight.intensity);

    // Hemisphere Light
    const hemisphereLight = scene.children.find(
      (child) => child instanceof THREE.HemisphereLight
    ) as THREE.HemisphereLight;

    expect(hemisphereLight).toBeDefined();

    expect(hemisphereLight.groundColor.getHex()).toBe(
      new THREE.Color(options.hemisphereLight.groundColor).getHex()
    );
    expect(hemisphereLight.intensity).toBe(options.hemisphereLight.intensity);

    // Directional Light
    const directionalLight = scene.children.find(
      (child) => child instanceof THREE.DirectionalLight
    ) as THREE.DirectionalLight;

    expect(directionalLight).toBeDefined();
    expect(directionalLight.color.getHex()).toBe(
      new THREE.Color(options.directionalLight.color).getHex()
    );
    expect(directionalLight.intensity).toBe(options.directionalLight.intensity);
    expect(
      directionalLight.position.equals(options.directionalLight.position)
    ).toBe(true);
    expect(directionalLight.castShadow).toBe(
      options.directionalLight.castShadow
    );

    if (directionalLight.castShadow) {
      expect(directionalLight.shadow.mapSize.width).toBe(
        options.directionalLight.shadow.mapSize.width
      );
      expect(directionalLight.shadow.mapSize.height).toBe(
        options.directionalLight.shadow.mapSize.height
      );

      expect(directionalLight.shadow.camera.near).toBe(
        options.directionalLight.shadow.camera.near
      );
      expect(directionalLight.shadow.camera.far).toBe(
        options.directionalLight.shadow.camera.far
      );
      expect(directionalLight.shadow.camera.left).toBe(
        options.directionalLight.shadow.camera.left
      );
      expect(directionalLight.shadow.camera.right).toBe(
        options.directionalLight.shadow.camera.right
      );
      expect(directionalLight.shadow.camera.top).toBe(
        options.directionalLight.shadow.camera.top
      );
      expect(directionalLight.shadow.camera.bottom).toBe(
        options.directionalLight.shadow.camera.bottom
      );

      expect(directionalLight.shadow.bias).toBe(
        options.directionalLight.shadow.bias
      );
      expect(directionalLight.shadow.radius).toBe(
        options.directionalLight.shadow.radius
      );
    }
  });
});
