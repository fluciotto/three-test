import { Vector3 } from 'three';
import Object3d from '../../Object3d';
import Triangle from '../../Triangle';

export type TriangleVsTriangle = {
  object1: Object3d;
  object2: Object3d;
  triangle1: Triangle;
  triangle2: Triangle;
  distance: number;
  normal: Vector3;
};
