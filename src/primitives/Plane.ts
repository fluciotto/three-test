import {
  PlaneGeometry,
  Line3,
  Mesh,
  MeshBasicMaterial,
  Vector2,
  Vector3,
} from 'three';
import Object3d from './Object3d';

class Plane extends Object3d {
  dimension: Vector2;

  constructor(
    isStatic: boolean,
    dimension: Vector2,
    position?: Vector3,
    velocity?: Vector3,
    acceleration?: Vector3
  ) {
    super(
      isStatic,
      new PlaneGeometry(dimension.x, dimension.y, 1, 1),
      Infinity,
      position,
      velocity,
      acceleration
    );
    this.dimension = dimension;
    //this.c = color(255*Math.random(), 255*Math.random(), 255*Math.random());

    console.log(this);

    this.material.wireframe = true;

    //console.log(this.o.geometry.getAttribute("normal"))

    // console.log(this.geometry);

    //this.raycaster = new THREE.Raycaster()
  }
}

export default Plane;
