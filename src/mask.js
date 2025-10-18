import { HemisphereLight } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { MindARThree } from "../static/libs/mindar-face-three.prod";
import maskModel from "../static/models/mask_cheburashka_03_comp-v1.glb";
// import maskModel from "../static/models/helmet1.glb";


const container = document.getElementById("container-mask");

let mindarThree = null;
let avatar = null;
let isInitialized = false;
let isRunning = false;

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

export const initMask = async () => {
  if (isInitialized) return;

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

const startMask = async () => {
  if (!isInitialized) await initMask();

  container.classList.remove("hidden");
  await mindarThree.start();
  isRunning = true;
};

const pauseMask = async () => {
  if (!isInitialized || !isRunning) return;
  await mindarThree.pause();
  isRunning = false;
  container.classList.add("hidden");
};

const stopMask = async () => {
  if (!isInitialized) return;
  await mindarThree.stop();
  container.classList.add("hidden");
  mindarThree = null;
  avatar = null;
  isInitialized = false;
  isRunning = false;
};

export { startMask, pauseMask, stopMask };
