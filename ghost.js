import * as THREE from "three";
import { PeppersGhostEffect } from "three/addons/effects/PeppersGhostEffect.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let container;

let camera, scene, renderer, effect, MyObj, mixer;

container = document.createElement("div");
document.body.appendChild(container);

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);
container.appendChild(renderer.domElement);

//Se crea el efecto PeppersGhost
effect = new PeppersGhostEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
effect.cameraDistance = 10;

window.addEventListener("resize", onWindowResize);

camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  100000
);

//Escena
scene = new THREE.Scene();

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.color.setHSL(10, 10, 10);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);

const loader = new GLTFLoader();

loader.load(
  "model/scene.gltf",
  (object) => {
    MyObj = object.scene;
    scene.add(MyObj);
    MyObj.scale.set(0.07, 0.07, 0.07);
    MyObj.position.set(0, 0, 0);

    if (object.animations.length > 0) {
      mixer = new THREE.AnimationMixer(MyObj);
      const action = mixer.clipAction(object.animations[0]);
      mixer.stopAllAction();
      action.play();
    }
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);

//Ajuste a pantalla
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize(window.innerWidth, window.innerHeight);
}

// Animaciones
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  effect.render(scene, camera);
}
