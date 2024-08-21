import * as THREE from 'three';

class Resizer {
  resize(object: THREE.Object3D, targetSize: THREE.Vector3): void {
    // Compute the bounding box of the object
    const boundingBox = new THREE.Box3().setFromObject(object);
    const objectSize = new THREE.Vector3();
    boundingBox.getSize(objectSize);

    // Calculate the scale factors for each dimension
    const scaleX = targetSize.x / objectSize.x;
    const scaleY = targetSize.y / objectSize.y;
    const scaleZ = targetSize.z / objectSize.z;

    // Determine the uniform scale factor to maintain proportions
    const scaleFactor = Math.min(scaleX, scaleY, scaleZ);

    // Apply the scale to the object
    object.scale.setScalar(scaleFactor);

    // Update the object's bounding box after scaling
    object.updateMatrixWorld(true);
  }
}

export default Resizer;
