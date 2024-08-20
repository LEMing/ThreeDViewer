import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { cleanupScene, setupScene, updateSize } from './simpleViewerUtils';
const SimpleViewer = ({ object }) => {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    useEffect(() => {
        if (!mountRef.current)
            return;
        const resizeHandler = () => updateSize(rendererRef.current, cameraRef.current, mountRef);
        const { renderer } = setupScene({ mountRef, rendererRef, cameraRef }, object);
        resizeHandler(); // Initial size update
        window.addEventListener('resize', resizeHandler);
        return () => cleanupScene(mountRef, renderer, resizeHandler);
    }, [object]);
    return _jsx("div", { style: { width: '100%', height: '100%' }, ref: mountRef });
};
export default SimpleViewer;
