# ThreeDViewer

ThreeDViewer is a React component library for easily integrating Three.js-based 3D viewers into your web applications. It provides a simple and customizable way to display and interact with 3D objects in your React projects.

## Features

- Easy integration with React applications
- Customizable viewer settings
- Support for various 3D object formats
- Built-in camera controls
- Responsive design

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

Here's a basic example of how to use the SimpleViewer component:

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

## API

### SimpleViewer

The main component for displaying 3D objects.

Props:
- `object` (required): A Three.js Object3D to be displayed in the viewer.

## Development

To set up the project for development:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ThreeDViewer.git
   ```

2. Install dependencies:
   ```
   cd ThreeDViewer
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Build the project:
   ```
   npm run build
   ```

## Testing

Run the test suite with:

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Three.js for providing the 3D rendering capabilities
- React for the component-based architecture
