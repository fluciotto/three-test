import { Vector3 } from 'three';
import { Object3d } from '../primitives';
import * as collisions from './collisions';

const G = 9.81;

let time: number, oldTime: number;
let allObjects: Object3d[] = [];
let dynamicObjects: Object3d[] = [];

export function init(objects: Object3d[]) {
  allObjects = objects;
  dynamicObjects = objects.filter((object) => !object.isStatic);
  dynamicObjects.forEach((object) => {
    object.acceleration = new Vector3(0, 0, -G);
  });
}

export function compute() {
  time = new Date().getTime();
  const dt = oldTime !== undefined ? (time - oldTime) / 1000 : 0;
  oldTime = time;

  // Collisions
  // const collidedObjects = collisions.detect([...balls, ...boxes]);
  const collidedObjects = collisions.detect(allObjects);
  collisions.handle(collidedObjects);

  // Gravity
  dynamicObjects
    // .filter((object) => !collidedObjects.includes(object))
    .forEach((object) => {
      object.velocity.add(
        new Vector3(
          object.acceleration.x * dt,
          object.acceleration.y * dt,
          object.acceleration.z * dt
        )
      );
      // console.log('object.velocity', object.velocity);
      object.position.add(
        new Vector3(
          object.velocity.x * dt,
          object.velocity.y * dt,
          object.velocity.z * dt
        )
      );
      // console.log('object.position', object.position);

      object.rotation.x += object.angularVelocity.x * dt;
      object.rotation.y += object.angularVelocity.y * dt;
      object.rotation.z += object.angularVelocity.z * dt;
    });
}
