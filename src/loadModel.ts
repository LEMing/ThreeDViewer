import * as THREE from 'three';
import FloorAligner from './FloorAligner';
import Resizer from './Resizer';
import {LoaderGLB} from './types';

export const loadModel = (url: string, loader: LoaderGLB, targetSize?: THREE.Vector3): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        if (targetSize) {
          new Resizer().resize(model, targetSize);
        }
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
