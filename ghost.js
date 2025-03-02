import * as THREE from "three";
import { PeppersGhostEffect } from "three/addons/effects/PeppersGhostEffect.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

let container;

let camera, scene, renderer, effect, MyObj;

container = document.createElement("div");
document.body.appendChild(container);

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);
container.appendChild(renderer.domElement);

//Se crea el efecto PeppersGhost
effect = new PeppersGhostEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
effect.cameraDistance = 90;

window.addEventListener("resize", onWindowResize);

camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  100000
);

//Escena
scene = new THREE.Scene();
scene.background = new THREE.Color(0x331B26);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.color.setHSL(10, 10, 10);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);

const loader = new FBXLoader();

loader.load(
  "model/Ghost.fbx",
  (object) => {
    MyObj = object;
    MyObj.scale.set(0.14, 0.14, 0.14);
    MyObj.position.set(0, -25, 0);
    scene.add(MyObj);
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
function animate() {
  if (MyObj) {
    MyObj.rotation.y += 0.01;
  }
  effect.render(scene, camera);
}
