import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Grid (optional)
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Axes (optional)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Load Laptop Model
const loader = new GLTFLoader();

loader.load(
    './models/laptop.glb',

    function (gltf) {

        const laptop = gltf.scene;

        // Adjust these values if needed
        laptop.scale.set(1, 1, 1);
        laptop.position.set(0, 0, 0);

        scene.add(laptop);

        console.log("Laptop loaded successfully!");
    },

    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + "% loaded");

    },

    function (error) {

        console.error("Error loading model:", error);

    }
);

// Animation Loop
function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}

animate();

// Resize Window
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});