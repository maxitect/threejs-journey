import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import gsap from "gsap";
import GUI from "lil-gui";

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoad = () => {
  console.log("onLoad");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = () => {
  console.error("onError");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
doorColorTexture.generateMipmaps = false;
doorColorTexture.minFilter = THREE.NearestFilter;
doorColorTexture.magFilter = THREE.NearestFilter;

interface DebugObject {
  subdivision: number;
  spin: () => void;
  10;
  colour: string;
}

const gui = new GUI({
  width: 360,
  title: "Nice debug UI",
  closeFolders: false,
});

gui.hide();

window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    gui.show(gui._hidden);
  }
});

const debugObject: DebugObject = {
  colour: "",
  spin: function (): void {
    throw new Error("Function not implemented.");
  },
  subdivision: 0,
};

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

const scene = new THREE.Scene();

const material = new THREE.MeshBasicMaterial();

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  cursor.x = clientX / sizes.width - 0.5;
  cursor.y = -(clientY / sizes.height - 0.5);
});

debugObject.colour = "#f5c211";

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);

//scene.add(mesh);

const codeTweaks = gui.addFolder("Awesome Cube");
codeTweaks.close();

codeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
codeTweaks.add(mesh, "visible");
codeTweaks.add(material, "wireframe");
codeTweaks.addColor(debugObject, "colour").onChange(() => {
  material.color.set(debugObject.colour);
});

debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};
codeTweaks.add(debugObject, "spin");

debugObject.subdivision = 2;
codeTweaks
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    const newGeometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
  });

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const doc = document as Document & {
    webkitFullscreenElement?: Element;
    webkitExitFullscreen?: () => Promise<void>;
  };
  const fullscreenElement =
    document.fullscreenElement || doc.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    }
  }
});

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(0, 0, 3);
camera.lookAt(mesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
