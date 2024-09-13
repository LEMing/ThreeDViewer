import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import defaultOptions from './defaultOptions';
import {loadModel} from './loadModel';
import SimpleViewer from './SimpleViewer';
import * as THREE from 'three';
import {LoaderGLB} from './types';


const App = () => {
  const [object, setObject] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const MODEL_URL = 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb';
    const loader = new GLTFLoader();
    const targetSize = new THREE.Vector3(24, 24, 24);
    loadModel(MODEL_URL, loader as LoaderGLB, targetSize).then(setObject);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      {object && <SimpleViewer object={object} options={
        {
          ...defaultOptions,
          helpers: {
            ...defaultOptions.helpers,
            addGizmo: true
          }
        }
      }/>}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
