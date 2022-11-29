import {
  BufferGeometry,
  Color,
  Mesh,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  Vector3,
} from 'three';
import Triangle from './Triangle';

abstract class Object3d extends Mesh {
  isStatic: boolean;
  mass: number;
  // position: Vector3;
  velocity: Vector3;
  acceleration: Vector3;

  constructor(
    isStatic: boolean,
    geometry: BufferGeometry,
    mass: number,
    position?: Vector3,
    velocity?: Vector3,
    acceleration?: Vector3
  ) {
    super(geometry, new MeshLambertMaterial());
    this.computeTriangles();
    // super(geometry, new MeshPhysicalMaterial());
    // this.material.color = new Color('#ffffff');
    // this.material.roughness = 1;
    // this.material.metalness = 0;
    this.isStatic = isStatic;
    this.mass = mass;
    if (position) this.position.add(position);
    this.velocity = velocity || new Vector3(0, 0, 0);
    this.acceleration = acceleration || new Vector3(0, 0, 0);
  }

  // Compute triangles from geometry and put them in geometry.userData
  // !!! Works only with indexed geometries !!!
  computeTriangles() {
    console.log('computeTriangles');
    this.geometry.userData = {
      triangles: this.geometry.index
        ? Array((this.geometry.index.array.length || 0) / 3)
            .fill(0)
            .map((_, i) => {
              const indices = this.geometry.index.array.slice(i * 3, i * 3 + 3);
              const positions = this.geometry.attributes.position.array;
              const vertices = [
                new Vector3(
                  positions[indices[0] * 3],
                  positions[indices[0] * 3 + 1],
                  positions[indices[0] * 3 + 2]
                ).add(this.position),
                new Vector3(
                  positions[indices[1] * 3],
                  positions[indices[1] * 3 + 1],
                  positions[indices[1] * 3 + 2]
                ).add(this.position),
                new Vector3(
                  positions[indices[2] * 3],
                  positions[indices[2] * 3 + 1],
                  positions[indices[2] * 3 + 2]
                ).add(this.position),
              ];
              const normals = this.geometry.attributes.normal.array;
              const normal = new Vector3(
                normals[indices[0] * 3],
                normals[indices[0] * 3 + 1],
                normals[indices[0] * 3 + 2]
              );
              return new Triangle(vertices, normal);
            })
        : [],
    };
  }
}

export default Object3d;
