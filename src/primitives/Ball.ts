import { SphereGeometry, Vector3 } from 'three';
import Object3d from './Object3d';

class Ball extends Object3d {
  radius: number;

  constructor(
    isStatic: boolean,
    radius: number,
    position?: THREE.Vector3,
    velocity?: THREE.Vector3,
    acceleration?: THREE.Vector3
  ) {
    super(
      isStatic,
      new SphereGeometry(radius, 8, 8),
      Math.pow(radius, 3),
      position,
      velocity,
      acceleration
    );
    this.radius = radius;
    // console.log(this.geometry);
    this.material.wireframe = true;
  }
}

export default Ball;
