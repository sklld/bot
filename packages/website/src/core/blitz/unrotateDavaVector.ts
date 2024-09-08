import { I_HAT } from '@blitzkit/core';
import { Vector3 } from 'three';

export function unrotateDavaVector(vector: Vector3) {
  return vector.applyAxisAngle(I_HAT, -Math.PI / 2);
}
