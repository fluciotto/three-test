import { Vector3 } from 'three';
import { Ball, Box, Triangle } from '../../primitives';
import { BallVsEdge, BallVsTriangle } from './@types';

export function detect(balls: Ball[], boxes: Box[]) {
  const {
    ballsVsTriangles,
    ballsVsEdges,
  }: { ballsVsTriangles: BallVsTriangle[]; ballsVsEdges: BallVsEdge[] } = balls
    .flatMap((ball) =>
      ([] as any[])
        .concat(
          boxes.flatMap((box) => box.geometry.userData.triangles as Triangle[])
        )
        .map((triangle) => [ball, triangle])
    )
    .reduce(
      (acc: any, combination) => {
        const [ball, triangle] = combination;
        // https://stackoverflow.com/a/22097356
        const distance = Math.abs(
          ball.position.clone().sub(triangle.position).dot(triangle.normal)
        );
        if (distance >= ball.radius) {
          return acc;
        }
        // https://www.quora.com/How-can-you-make-a-projection-of-a-vector-onto-a-plane
        const trianglePlaneContactPoint = ball.position
          .clone()
          .projectOnPlane(triangle.normal);
        // https://stackoverflow.com/a/8944143
        // const trianglePlaneContactPoint = ball.position
        //   .clone()
        //   .sub(
        //     triangle.normal
        //       .clone()
        //       .multiplyScalar(
        //         ball.position
        //           .clone()
        //           .sub(triangle.position)
        //           .dot(triangle.normal)
        //       )
        //   );
        if (triangle.containsPoint(trianglePlaneContactPoint)) {
          acc.ballsVsTriangles = [
            ...(acc.ballsVsTriangles || []),
            { ball, triangle, distance, normal: triangle.normal },
          ];
        } else {
          for (let i = 0; i < triangle.edges.length; i++) {
            const edge = triangle.edges[i];
            const edgeLineContactPoint = new Vector3();
            edge.closestPointToPoint(ball.position, true, edgeLineContactPoint);
            const edgeVector = edge.end.clone().sub(edge.start);
            // https://gamedev.stackexchange.com/a/72529
            // const edgeVector = edge.end.clone().sub(edge.start);
            // const edgeLineContactPoint = edge.start
            //   .clone()
            //   .add(
            //     edgeVector
            //       .clone()
            //       .multiplyScalar(
            //         ball.position.clone().sub(edge.start).dot(edgeVector) /
            //           edgeVector.dot(edgeVector)
            //       )
            //   );
            const distance = ball.position.distanceTo(edgeLineContactPoint);
            if (distance < ball.radius) {
              const collisionNormal = ball.position
                .clone()
                .sub(edgeLineContactPoint)
                .normalize();
              acc.ballsVsEdges = [
                ...(acc.ballsVsEdges || []),
                { ball, edge, distance, normal: collisionNormal },
              ];
            }
          }
        }
        return acc;
      },
      { ballsVsTriangles: [], ballsVsEdges: [] }
    );
  return { ballsVsTriangles, ballsVsEdges };
}

export function handle1(collisions: BallVsTriangle[]) {
  collisions.forEach((collision) => {
    console.log('> Triangle collision');
    console.log('distance', collision.distance);
    // Correct ball position
    collision.ball.position.add(
      collision.normal
        .clone()
        .multiplyScalar(
          collision.ball.radius - collision.distance + Number.MIN_VALUE
        )
    );
    console.log('distance', collision.distance);
    // Compute ball velocity
    const J =
      (2 - 0.3) *
      collision.normal.clone().dot(collision.ball.velocity) *
      collision.ball.mass;
    console.log('ball.velocity', collision.ball.velocity);
    collision.ball.velocity.sub(
      collision.normal.clone().multiplyScalar(J / collision.ball.mass)
    );
    console.log('ball.velocity', collision.ball.velocity);
  });
}

export function handle2(collisions: BallVsEdge[]) {
  collisions.forEach((collision) => {
    // const toto =
    //   ball.velocity.clone().dot(collisionNormal) /
    //   ball.velocity.clone().dot(ball.velocity);
    console.log('> Edge collision');
    // console.log('distanceToEdge', distanceToEdge);
    // console.log('edge', edge);
    // console.log('edgeVector', edgeVector);
    // console.log('triangle', triangle);
    // console.log('trianglePlaneContactPoint', trianglePlaneContactPoint);
    // console.log('ball.position', ball.position);
    // console.log('edgeLineContactPoint', edgeLineContactPoint);
    // console.log('collisionNormal', collisionNormal);
    // console.log('toto', toto);
    // if (Math.abs(toto) < 0.01) continue;
    // Correct ball position
    collision.ball.position.add(
      collision.normal
        .clone()
        .multiplyScalar(
          collision.ball.radius - collision.distance + Number.MIN_VALUE
        )
    );
    // console.log(
    //   'distanceToEdge',
    //   ball.position.distanceTo(edgeLineContactPoint)
    // );
    // Compute ball velocity
    const J =
      (2 - 0.2) *
      collision.normal.clone().dot(collision.ball.velocity) *
      collision.ball.mass;
    console.log('ball.velocity', collision.ball.velocity);
    collision.ball.velocity.sub(
      collision.normal.clone().multiplyScalar(J / collision.ball.mass)
    );
    console.log('ball.velocity', collision.ball.velocity);
  });
}
