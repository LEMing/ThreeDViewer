import React from 'react'
import ReactDOM from 'react-dom/client'
import SimpleViewer from './SimpleViewer'
import * as THREE from 'three'

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <SimpleViewer object={cube} />
    </div>
  </React.StrictMode>
)
