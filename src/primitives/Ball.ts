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
      new SphereGeometry(radius, 6, 6),
      Math.pow(radius, 3),
      position,
      velocity,
      acceleration
    );
    this.radius = radius;
    // console.log(this.geometry);
  }
}

export default Ball;