import { Line3, MathUtils, Triangle as ThreeTriangle, Vector3 } from 'three';

class Triangle {
  uuid: string;
  private _vertices: Vector3[] = [];
  get vertices() {
    return this._vertices;
  }
  set vertices(vertices) {
    this._vertices = vertices;
    this.edges = vertices.map(
      (vertex, i) =>
        new Line3(
          vertex,
          i + 1 < vertices.length ? vertices[i + 1] : vertices[0]
        )
    );
    this.position = vertices.reduce(
      (acc, vertex, i) =>
        new Vector3(
          acc.x + (vertex.x - acc.x) / (i + 1),
          acc.y + (vertex.y - acc.y) / (i + 1),
          acc.z + (vertex.z - acc.z) / (i + 1)
        ),
      new Vector3(0, 0, 0)
    );
  }

  edges: Line3[] = [];
  position: Vector3;
  normal: Vector3;

  constructor(vertices: Vector3[], normal: Vector3) {
    this.uuid = MathUtils.generateUUID();
    this.vertices = vertices;
    this.normal = normal;
  }

  containsPoint(point: Vector3) {
    return ThreeTriangle.containsPoint(
      point,
      this.vertices[0],
      this.vertices[1],
      this.vertices[2]
    );
  }
}

export default Triangle;
