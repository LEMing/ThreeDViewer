import * as THREE from 'three';
import {LoaderGLB} from './types';

export const loadModel = (url: string, loader: LoaderGLB): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(10);
        resolve(model);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
        reject(error);
      }
    );
  });
};
