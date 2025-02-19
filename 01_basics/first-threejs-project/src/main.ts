import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const scene = new THREE.Scene();

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  cursor.x = clientX / sizes.width - 0.5;
  cursor.y = -(clientY / sizes.height - 0.5);
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);

scene.add(mesh);

const sizes = {
  width: 800,
  height: 600,
};

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
camera.position.set(0, 0, 3);
camera.lookAt(mesh.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();
  // mesh.rotation.y = elapsedTime;

  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  camera.position.y = cursor.y * 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
