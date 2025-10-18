import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DeviceOrientationControls from "./DeviceOrientationControls";
import gsap from "gsap";

let textures = []; // массив текстур
let currentIndex = 0;
let sphere = null;
let scene = null;

const mindarScene = document.querySelector("a-scene");
const closeBtn = document.querySelector("#panoramaCloseBtn");
const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
const canvas = document.querySelector(".panorama");
const rightBTN = document.querySelector(".btn-right");
const leftBTN = document.querySelector(".btn-left");
const maskBtn = document.querySelector("#maskBtn");
const arSystem = mindarScene.systems["mindar-image-system"];

closeBtn.addEventListener("click", () => {
  arSystem.start();
  canvas.classList.add("hidden");
  leftBTN.classList.add("hidden");
  rightBTN.classList.add("hidden");
  closeBtn.classList.add("hidden");

  // Show mask button when returning to AR mode
  maskBtn.classList.remove("hidden");
});

//
// Предзагрузка текстур (Promise)
const preloadTextures = (paths) => {
  return new Promise((resolve, reject) => {
    const manager = new THREE.LoadingManager(resolve, undefined, reject);
    const loader = new THREE.TextureLoader(manager);
    textures = paths.map((path) => loader.load(path));
  });
};

//
// Плавная смена панорамы
//
const setPanorama = (index) => {
  if (!sphere || textures.length === 0) return;
  const newIndex = (index + textures.length) % textures.length;
  if (newIndex === currentIndex) return;

  const newSphere = new THREE.Mesh(
    sphere.geometry.clone(),
    new THREE.MeshBasicMaterial({
      map: textures[newIndex],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    })
  );
  scene.add(newSphere);

  const oldSphere = sphere;
  sphere = newSphere;
  currentIndex = newIndex;

  // плавный переход
  gsap.to(newSphere.material, { opacity: 1, duration: 1 });
  gsap.to(oldSphere.material, {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      scene.remove(oldSphere);
      oldSphere.geometry.dispose();
      oldSphere.material.dispose();
    },
  });
};

//
// Запуск панорамы
//
const startPanorama = (isOrientationGranted) => {
  // сцена
  scene = new THREE.Scene();

  // камера
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1, 0);

  // рендерер
  const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
    antialias: true,
    canvas,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(devicePixelRatio);
  renderer.outputEncoding = THREE.SRGBColorSpace;
  renderer.setSize(window.innerWidth, window.innerHeight);

  // первая сфера
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(20, 32, 16),
    new THREE.MeshBasicMaterial({
      map: textures[0],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1,
    })
  );
  scene.add(sphere);

  // управление
  let controls;
  if (isOrientationGranted) {
    controls = new DeviceOrientationControls(camera);
  } else {
    controls = new OrbitControls(camera, renderer.domElement); //для теста с ПК/ноута
  }
  controls.enableDamping = true;

  // анимация
  const animate = () => {
    requestAnimationFrame(animate);
    if (canvas.classList.contains("hidden")) return;
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // ресайз
  window.addEventListener("resize", () => {
    resize(camera, renderer);
  });

  // кнопки
  leftBTN.addEventListener("click", () => {
    setPanorama(currentIndex - 1);
  });
  rightBTN.addEventListener("click", () => {
    setPanorama(currentIndex + 1);
  });
};

//
// Resize
//
const resize = (camera, renderer) => {
  const { clientWidth, clientHeight } = document.documentElement;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight);
};

export { startPanorama, preloadTextures, setPanorama };
