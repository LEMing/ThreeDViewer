import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import SimpleViewer from './SimpleViewer';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const MODEL_URL = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'; // URL of the GLB model

const loadModel = (): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;
        model.castShadow = true; // Ensure the model casts shadows
        model.scale.setScalar(10); // Scale the model down
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

const App = () => {
  const [object, setObject] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    loadModel().then(setObject);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      {object && <SimpleViewer object={object} />}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
