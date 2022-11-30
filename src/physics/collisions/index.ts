import { Object3d, Triangle } from '../../primitives';
import { TriangleVsTriangle } from './@types';

// type Collisions = TriangleVsTriangle[];

//
// Collisions detection
//
export function detect(objects: Object3d[]) {
  const objectsCombinations = objects
    .filter((object) => object.velocity.length() !== 0)
    .flatMap((object1, i) =>
      objects.slice(i + 1).map((object2) => [object1, object2])
    );

  // console.log('objectsCombinations', objectsCombinations);

  // const trianglesCombinations = objectsCombinations.reduce(
  //   (acc: Triangle[][], combination: Object3d[]) => {
  //     const [object1, object2] = combination;
  //     const object1Triangles = object1.geometry.userData
  //       .triangles as Triangle[];
  //     const object2Triangles = object2.geometry.userData
  //       .triangles as Triangle[];
  //     return object1Triangles.flatMap((triangle1) =>
  //       object2Triangles
  //         .map((triangle2) => {
  //           // if (triangle1.normal.dot(triangle2.normal) > 0) return;
  //           return [triangle1, triangle2];
  //         })
  //         .filter((t) => t)
  //     );
  //   },
  //   []
  // );

  // console.log('trianglesCombinations', trianglesCombinations);
  // return;

  const collisions: TriangleVsTriangle[] = objectsCombinations.reduce(
    (acc: TriangleVsTriangle[], combination: Object3d[]) => {
      const [object1, object2] = combination;
      const object1Triangles = object1.geometry.userData
        .triangles as Triangle[];
      const object2Triangles = object2.geometry.userData
        .triangles as Triangle[];
      const trianglesCombinations = object1Triangles.flatMap(
        (triangle1) =>
          object2Triangles.reduce((acc: Triangle[][], triangle2) => {
            // if (triangle1.normal.dot(triangle2.normal) >= 0) return acc;
            return [...acc, [triangle1, triangle2]];
          }, [])
        // object2Triangles
        //   .map((triangle2) => {
        //     // if (triangle1.normal.dot(triangle2.normal) > 0) return;
        //     return [triangle1, triangle2];
        //   })
        //   .filter((t) => t)
      );
      // console.log('trianglesCombinations', trianglesCombinations);
      trianglesCombinations.forEach((c: Triangle[]) => {
        const [triangle1, triangle2] = c;
        const [v0, v1, v2] = triangle1.vertices.map((vertex) =>
          object2.worldToLocal(object1.localToWorld(vertex.clone()))
        );
        // console.log(triangle1.vertices, [v0, v1, v2]);
        if (
          Math.abs(v0.z) < 1e-6 ||
          Math.abs(v1.z) < 1e-6 ||
          Math.abs(v2.z) < 1e-6
        ) {
          return acc;
        }
        const s = Math.sign(v0.z) + Math.sign(v1.z) + Math.sign(v2.z);
        // console.log(v0.z, v1.z, v2.z, s);
        if (s !== 0 && s !== -3 && s !== 3) {
          console.log('COLLISION!!!!');
          console.log(triangle1.vertices, [v0, v1, v2]);
          const nearestVertex = [v0, v1, v2].sort((v1, v2) =>
            v1.z < v2.z ? -1 : v1.z > v2.z ? 1 : 0
          )[0];
          if (!triangle2.containsPoint(nearestVertex)) {
            return acc;
          }
          const collisionNormal = triangle2.normal
            .clone()
            .applyQuaternion(object2.quaternion);
          acc = [
            ...acc,
            {
              object1,
              object2,
              triangle1,
              triangle2,
              distance: Math.min(v0.z, v1.z, v2.z),
              normal: collisionNormal,
            },
          ];
        }
      });
      // console.log(trianglesCombinations.length, min, max);
      return acc.slice(0, 1);
    },
    []
  );

  // if (collisions.length) console.log('collisions', collisions);

  return collisions;
}

//
// Collisions handling
//
export function handle(collisions: TriangleVsTriangle[]) {
  collisions.forEach((collision) => {
    // console.log('> Triangle collision');
    // console.log('distance', collision.distance);

    // Correct ball position
    // console.log('object1.position', collision.object1.position);
    collision.object1.position.sub(
      collision.normal
        .clone()
        .multiplyScalar(collision.distance + Number.MIN_VALUE)
    );
    // console.log('object1.position', collision.object1.position);

    // Compute ball velocity

    // const J =
    //   (2 - 0.3) *
    //   collision.normal.clone().dot(collision.object1.velocity) *
    //   collision.object1.mass;

    const J =
      ((2 - 0.3) *
        collision.normal
          .clone()
          .dot(
            collision.object1.velocity.clone().sub(collision.object2.velocity)
          )) /
      (1 / collision.object1.mass + 1 / collision.object2.mass);

    // console.log('object1.velocity', collision.object1.velocity);
    collision.object1.velocity.sub(
      collision.normal.clone().multiplyScalar(J / collision.object1.mass)
    );
    collision.object2.velocity.add(
      collision.normal.clone().multiplyScalar(J / collision.object2.mass)
    );
    // console.log('object1.velocity', collision.object1.velocity);

    const velocityDiff = collision.object2.velocity
      .clone()
      .sub(collision.object1.velocity);
    // collision.object1.angularVelocity.x = velocityDiff.y / (5 * 2 * Math.PI);
    collision.object1.angularVelocity.x =
      velocityDiff.y /
      collision.object1
        .localToWorld(collision.triangle1.position)
        .sub(collision.object1.position)
        .length();
  });
}
