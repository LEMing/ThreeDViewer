import {
  WebGLPathTracer,
  PhysicalCamera,
  BlurredEnvMapGenerator,
} from 'three-gpu-pathtracer';

export {type WebGLPathTracer} from 'three-gpu-pathtracer';

export const importRaytracer = () => {
  return {
    WebGLPathTracer,
    PhysicalCamera,
    BlurredEnvMapGenerator
  }
}
