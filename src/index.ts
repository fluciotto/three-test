import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Color,
  DirectionalLight,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { Ball, Box, Object3d, Plane } from './primitives';
import * as physics from './physics';

let paused = false;

let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
//let group: THREE.Group;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

const planes: Plane[] = [];
const boxes: Box[] = [];
const balls: Ball[] = [];

function init() {
  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') paused = !paused;
    if (e.code === 'KeyR') document.location.reload();
  });
  // Camera
  camera = new PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.x = 600;
  camera.position.z = 0;
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  initScene();
}

function initScene() {
  // Scene
  scene = new Scene();
  scene.background = new Color(0x222222);
  //scene.fog = new Fog(0x2b2b2b, 1, 10000);
  var geometry = new BoxGeometry(100, 100, 100);
  var material = new MeshNormalMaterial();

  scene.add(new AxesHelper(100));

  scene.add(new AmbientLight(0xffffff, 0.4));
  scene.add(new DirectionalLight(0xffffff, 0.5));

  // const fallingPlane = new Plane(
  //   false,
  //   new Vector2(200, 200),
  //   new Vector3(0, 0, 100)
  // );
  // fallingPlane.mass = 100;
  // fallingPlane.rotateY(Math.PI / 4);
  // fallingPlane.rotateX(Math.PI / 4);
  // planes.push(fallingPlane);

  const fixedPlane = new Plane(
    true,
    new Vector2(200, 200),
    new Vector3(0, 50, 0)
  );
  fixedPlane.rotateX(Math.PI / 6);
  planes.push(fixedPlane);
  planes.forEach((plane) => scene.add(plane));

  // boxes.push(new Box(true, new Vector3(200, 200, 10), new Vector3(0, 0, -200)));
  // boxes.push(new Box(new Vector3(10, 200, 600), new Vector3(-100, 0, 100)));
  // boxes.push(new Box(new Vector3(10, 200, 600), new Vector3(100, 0, 100)));
  // boxes.push(new Box(new Vector3(200, 10, 600), new Vector3(0, -100, 100)));
  // boxes.push(new Box(new Vector3(200, 10, 600), new Vector3(0, 100, 100)));

  // boxes.push(new Box(new Vector3(200, 200, 10), new Vector3(0, 100, 100)));
  // boxes.push(new Box(new Vector3(200, 200, 10), new Vector3(0, -100, -60)));
  // console.log('boxes', boxes);
  boxes.forEach((box) => scene.add(box));

  const ball1 = new Ball(false, 40); 
  ball1.position.add(new Vector3(0, -50, 0));
  ball1.velocity = new Vector3(0, 50, 0);
  balls.push(ball1);
  const ball2 = new Ball(false, 30);
  ball2.position.add(new Vector3(0, -50, 100));
  ball2.velocity = new Vector3(0, 40, 0);
  balls.push(ball2);

  // balls.push(new Ball(35, new Vector3(0, 20, 200)));
  // balls.push(new Ball(30, new Vector3(0, -10, 100)));
  // balls.push(new Ball(25, new Vector3(0, -10, 100)));
  // balls.push(new Ball(20, new Vector3(0, -10, 100)));
  // for (let i = 0; i < 100; i++) {
  //   balls.push(new Ball(20, new Vector3(0, 0, 120)));
  // }
  // console.log('balls', balls);
  balls.forEach((ball) => scene.add(ball));

  // Do physics!
  physics.init([...balls, ...boxes, ...planes]);
  setInterval(() => {
    if (paused) return;
    // physics.compute(balls, boxes);
    physics.compute();
  }, 10);

  //document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  // var time = Date.now() * 0.001;
  // var rx = Math.sin(time * 0.7) * 0.5,
  //   ry = Math.sin(time * 0.3) * 0.5,
  //   rz = Math.sin(time * 0.2) * 0.5;
  //camera.position.x += (mouseX - camera.position.x) * 0.05;
  //camera.position.y += (-mouseY - camera.position.y) * 0.05;
  //camera.lookAt(scene.position);
  //group.rotation.x = rx;
  //group.rotation.y = ry;
  //group.rotation.z = rz;
  // physics();
  renderer.render(scene, camera);
}

export default function () {
  init();
  animate();
}
