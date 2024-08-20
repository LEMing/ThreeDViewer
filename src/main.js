import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import SimpleViewer from './SimpleViewer';
import * as THREE from 'three';
const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx("div", { style: { width: '100vw', height: '100vh', margin: 0, padding: 0 }, children: _jsx(SimpleViewer, { object: cube }) }) }));
