import * as THREE from 'three';
import { RendererOptions } from '../../types';

export const initializeRenderer = (rendererOptions: RendererOptions) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: rendererOptions.antialias,
    alpha: rendererOptions.alpha,
  });

  renderer.setPixelRatio(rendererOptions.pixelRatio);

  renderer.shadowMap.enabled = rendererOptions.shadowMapEnabled;
  renderer.shadowMap.type = rendererOptions.shadowMapType;

  if (rendererOptions.toneMapping) {
    renderer.toneMapping = rendererOptions.toneMapping;
  }

  if (rendererOptions.toneMappingExposure !== undefined) {
    renderer.toneMappingExposure = rendererOptions.toneMappingExposure;
  }

  return renderer;
};
