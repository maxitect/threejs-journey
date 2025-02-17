import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0.7, -0.6, 1);
mesh.scale.set(2, 0.5, 0.5);
mesh.rotation.x = Math.PI / 4;
mesh.rotation.y = Math.PI / 4;

scene.add(mesh);

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 3);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
