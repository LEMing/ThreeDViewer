import * as THREE from 'three';
import { loadModel } from '../loadModel';

describe('loadModel', () => {
  it('should load a model and return a THREE.Object3D', async () => {
    const model = await loadModel(
      'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
       {
         load: (
           url,
           onLoad,
           onProgress,
           onError) => {
           if (onLoad) onLoad({scene: new THREE.Object3D()});
         }
       }
      );
    expect(model).toBeInstanceOf(THREE.Object3D);
  });
});
