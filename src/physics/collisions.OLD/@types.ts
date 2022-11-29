import { Vector3 } from 'three';
import Ball from '../../Ball';
import Object3d from '../../Object3d';
import Triangle from '../../Triangle';

export type BallVsBall = {
  ball1: Ball;
  ball2: Ball;
  distance: number;
  normal: Vector3;
};

export type BallVsTriangle = {
  ball: Ball;
  triangle: Triangle;
  distance: number;
  normal: Vector3;
};

export type BallVsEdge = {
  ball: Ball;
  triangle: Triangle;
  distance: number;
  normal: Vector3;
};

export type TriangleVsTriangle = {
  object1: Object3d;
  object2: Object3d;
  triangle1: Triangle;
  triangle2: Triangle;
  distance: number;
  normal: Vector3;
};
