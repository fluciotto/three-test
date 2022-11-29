import { Ball, Box } from '../../primitives';

import * as ballsVsBalls from './ballsVsBalls';
import * as ballsVsBoxes from './ballsVsBoxes';
import { BallVsBall, BallVsEdge, BallVsTriangle } from './@types';

type Collisions = {
  ballsVsBalls: BallVsBall[];
  ballsVsTriangles: BallVsTriangle[];
  ballsVsEdges: BallVsEdge[];
};

//
// Collisions detection
//
export function detect(balls: Ball[], boxes: Box[]) {
  const collisions: Collisions = {
    ballsVsBalls: ballsVsBalls.detect(balls),
    ...ballsVsBoxes.detect(balls, boxes),
  };

  if (
    collisions.ballsVsBalls.length ||
    collisions.ballsVsTriangles.length ||
    collisions.ballsVsEdges.length
  )
    console.log('collisions', collisions);

  // return Array.from(collidedObjects);
  return collisions;
}

//
// Collisions handling
//
export function handle(collisions: Collisions) {
  ballsVsBalls.handle(collisions.ballsVsBalls);
  ballsVsBoxes.handle1(collisions.ballsVsTriangles);
  ballsVsBoxes.handle2(collisions.ballsVsEdges);
}
