
# ThreeDViewer

ThreeDViewer is a React component library for easily integrating Three.js-based 3D viewers into your web applications. It provides a simple and customizable way to display and interact with 3D objects in your React projects.

![ThreeDGizmo Preview](https://github.com/LEMing/ThreeDViewer/raw/main/src/assets/cover.png)

## Features

- Easy integration with React applications
- Customizable viewer settings
- Support for various 3D object formats
- Built-in camera and map controls
- Optional gizmo controller
- Responsive design
- Ability to handle external scenes and Three.js objects

## Installation

To install ThreeDViewer, run the following command in your project directory:

```bash
npm install threedviewer
```

or if you're using yarn:

```bash
yarn add threedviewer
```

## Usage

Here's a basic example of how to use the `SimpleViewer` component:

```jsx
import React from 'react';
import { SimpleViewer } from 'threedviewer';
import * as THREE from 'three';

function App() {
   // Create a simple cube
   const geometry = new THREE.BoxGeometry(1, 1, 1);
   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
   const cube = new THREE.Mesh(geometry, material);

   return (
      <div style={{ width: '100%', height: '400px' }}>
        <SimpleViewer object={cube} />
      </div>
   );
}

export default App;
```

## Handling External Scenes and Advanced Usage

ThreeDViewer now supports handling external Three.js scenes and objects, allowing for more advanced configurations and custom controls. Here's an example that integrates external camera, scene, and controls:

```tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SimpleViewer, type SimpleViewerOptions, defaultOptions } from 'threedviewer';

function App() {
   const mountRef = useRef<HTMLDivElement | null>(null);
   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
   const sceneRef = useRef<THREE.Scene | null>(null);
   const controlsRef = useRef<OrbitControls | null>(null);
   
   const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
   const [scene, setScene] = useState<THREE.Scene | null>(null);
   
   useEffect(() => {
      if (cameraRef.current) {
        setCamera(cameraRef.current);
      }
      if (sceneRef.current) {
        setScene(sceneRef.current);
      }
   }, []);
   
   const options: SimpleViewerOptions = useMemo(() => ({
   ...defaultOptions,
   staticScene: false,
   backgroundColor: '#000000',
   camera: {
      ...defaultOptions.camera,
      position: [12 * 6, 12 * 6, 12 * 6],
      target: [0, 0, 0],
      fov: 60,
      autoFitToObject: false,
    },
   lights: {
      ...defaultOptions.lights,
      ambient: { intensity: 0.5 },
      directional: { position: [10, 10, 5] },
    },
   helpers: {
      ...defaultOptions.helpers,
      grid: true,
      axes: true,
      addGizmo: true, // New gizmo option
    },
   threeBaseRefs: {
      scene: sceneRef,
      camera: cameraRef,
      mountPoint: mountRef,
      controls: controlsRef,
      renderer: rendererRef,
    },
   }), []);
   
   return (
      <div style={{ width: '100%', height: '100vh' }}>
        <SimpleViewer object={null} options={options} />
      </div>
   );
}

export default App;
```

In this example, we demonstrate how to use external scene references, handle camera controls, and customize the viewer options, allowing more flexibility in your 3D environment.

## API

### SimpleViewer

The main component for displaying 3D objects.

Props:
- `object` (required): A Three.js `Object3D` to be displayed in the viewer.
- `options` (optional): An object containing viewer options (see below).

## Configuration Options

`SimpleViewer` accepts an `options` prop for customization. Here's an overview of available options:

```javascript
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
      type: ControlType.OrbitControls, // 'OrbitControls' or 'MapControls'
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
      addGizmo: false, // new Gizmo control is disabled by default
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
```

To use custom options, simply pass them to the `options` prop:

```tsx
const customOptions = {
   ...defaultOptions,
   backgroundColor: '#000000',
   camera: {
      ...defaultOptions.camera,
      position: [12 * 6, 12 * 6, 12 * 6],
      target: [0, 0, 0],
      fov: 60,
   },
};
```

## Development

To set up the project for development:

1. Clone the repository:
   ```
   git clone https://github.com/LEMing/threedviewer.git
   ```

2. Install dependencies:
   ```
   cd ThreeDViewer
   make install
   ```

3. Run the development server:
   ```
   make dev
   ```

4. Build the project:
   ```
   make build
   ```

## Testing

Run the test suite with:

```bash
make test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License

## Acknowledgments

- [Three.js](https://threejs.org/) for providing the 3D rendering capabilities
- [React](https://reactjs.org/) for the component-based architecture
