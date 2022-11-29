import { BoxGeometry, Line3, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import Object3d from './Object3d';

class Box extends Object3d {
  dimension: Vector3;

  constructor(
    isStatic: boolean,
    dimension: Vector3,
    position?: Vector3,
    velocity?: Vector3,
    acceleration?: Vector3
  ) {
    super(
      isStatic,
      new BoxGeometry(dimension.x, dimension.y, dimension.z, 1, 1, 1),
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

export default Box;
