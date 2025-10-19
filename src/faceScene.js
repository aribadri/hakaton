import { HemisphereLight } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { MindARThree } from "../static/libs/mindar-face-three.prod";
import maskModel from "../static/models/mask_cheburashka_03_comp-v1.glb";
// import maskModel from "../static/models/helmet1.glb";

let mindarThree = null;
let avatar = null;
let isInitialized = false;
let isRunning = false;
let container = null;

class Avatar {
  constructor() {
    this.gltf = null;
    this.morphTargetMeshes = [];
  }

  async init() {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const gltf = await loader.loadAsync(maskModel);

    gltf.scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.frustumCulled = false;
        obj.renderOrder = 1;
        if (obj.name === "okluder") {
          obj.renderOrder = 0;
          obj.material.colorWrite = false;
        }
      }
      if (obj.isMesh && obj.morphTargetInfluences) {
        this.morphTargetMeshes.push(obj);
      }
    });

    this.gltf = gltf;
  }

  updateBlendshapes(blendshapes) {
    const map = new Map(
      blendshapes.categories.map((c) => [c.categoryName, c.score])
    );

    for (const mesh of this.morphTargetMeshes) {
      if (!mesh.morphTargetDictionary) continue;
      for (const [name, value] of map) {
        const idx = mesh.morphTargetDictionary[name];
        if (idx !== undefined) mesh.morphTargetInfluences[idx] = value;
      }
    }
  }
}

export const initFaceScene = async () => {
  if (isInitialized) return;
  container = document.querySelector(".mask-content");
  mindarThree = new MindARThree({
    container,
    face: true,
    videoSettings: { facingMode: "user" },
  });

  const { renderer, scene, camera } = mindarThree;
  const light = new HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  const anchor = mindarThree.addAnchor(0);

  avatar = new Avatar();
  await avatar.init();

  avatar.gltf.scene.scale.set(3, 3, 3);
  avatar.gltf.scene.position.set(0, 0.25, -0.5);
  anchor.group.add(avatar.gltf.scene);

  // главный рендер-цикл
  renderer.setAnimationLoop(() => {
    if (!isRunning) return; // не рендерим, если на паузе
    const estimate = mindarThree.getLatestEstimate();
    if (estimate?.blendshapes) avatar.updateBlendshapes(estimate.blendshapes);
    renderer.render(scene, camera);
  });

  isInitialized = true;
};

const startFaceScene = async () => {
  if (!isInitialized) await initFaceScene();

  container.classList.remove("hidden");
  await mindarThree.start();
  isRunning = true;
};

const pauseFaceScene = async () => {
  if (!isInitialized || !isRunning) return;
  await mindarThree.pause();
  isRunning = false;
  container.classList.add("hidden");
};

const stopFaceScene = async () => {
  if (!isInitialized) return;

  isRunning = false; // Останавливаем рендер-цикл ПЕРВЫМ делом

  // Останавливаем animation loop
  if (mindarThree && mindarThree.renderer) {
    mindarThree.renderer.setAnimationLoop(null);
  }

  // Останавливаем MindAR
  await mindarThree.stop();

  // Очищаем Three.js объекты
  if (mindarThree) {
    const { renderer, scene } = mindarThree;

    // Удаляем все объекты из сцены
    while (scene.children.length > 0) {
      const object = scene.children[0];
      scene.remove(object);

      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => {
            if (mat.map) mat.map.dispose();
            mat.dispose();
          });
        } else {
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
      }
    }

    // Очищаем renderer
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      const gl = renderer.getContext();
      if (gl && gl.getExtension('WEBGL_lose_context')) {
        gl.getExtension('WEBGL_lose_context').loseContext();
      }
    }
  }

  // Очищаем avatar GLTF объекты
  if (avatar && avatar.gltf) {
    avatar.gltf.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => {
            if (mat.map) mat.map.dispose();
            mat.dispose();
          });
        } else {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      }
    });
  }

  // Останавливаем video stream
  if (mindarThree && mindarThree.video && mindarThree.video.srcObject) {
    const tracks = mindarThree.video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    mindarThree.video.srcObject = null;
  }

  // Очищаем container
  if (container) {
    container.classList.add("hidden");
    // Удаляем canvas из контейнера
    const canvas = container.querySelector('canvas');
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }

  mindarThree = null;
  avatar = null;
  isInitialized = false;
};

export const getFaceRenderer = () => mindarThree?.renderer;
export const getFaceCamera = () => mindarThree?.camera;
export const getFaceVideo = () => mindarThree?.video;
export const getFaceScene = () => mindarThree?.scene;

export const renderFaceFrame = () => {
  if (!mindarThree || !isRunning) return;
  const { renderer, scene, camera } = mindarThree;
  const estimate = mindarThree.getLatestEstimate();
  if (estimate?.blendshapes && avatar) avatar.updateBlendshapes(estimate.blendshapes);
  renderer.render(scene, camera);
};

export { startFaceScene, pauseFaceScene, stopFaceScene };
