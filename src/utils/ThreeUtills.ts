import {
  Mesh,
  Object3D,
  BoxGeometry,
  MeshStandardMaterial,
  Group,
} from "three";
export function createPlaceholder(config: any): Object3D {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ color: 0xff00ff });
  const cube = new Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = false;
  cube.scale.setScalar(config.scale || 1);

  return cube;
}

export function calculateVertext(
  obj: Object3D | Group | Mesh,
  depth = 0
): void {
  if (depth > 5) {
    return;
  }

  if (obj instanceof Mesh) {
    if (!obj.geometry.getAttribute("normal")) {
      const geometry = obj.geometry;
      geometry.computeVertexNormals();
    }
  }

  for (const child of obj.children) {
    calculateVertext(child, depth + 1);
  }
}
