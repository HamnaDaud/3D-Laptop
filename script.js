import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ===== Scene =====
const scene = new THREE.Scene();
scene.background = null; // let the CSS gradient show through

// ===== Camera =====
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1, 3);

// ===== Renderer =====
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = 'relative';
renderer.domElement.style.zIndex = '2';

// ===== Orbit Controls =====
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;
controls.minDistance = 0.5;
controls.maxDistance = 12;

let idleTimeout;
controls.addEventListener('start', () => {
    controls.autoRotate = false;
    clearTimeout(idleTimeout);
});
controls.addEventListener('end', () => {
    idleTimeout = setTimeout(() => { controls.autoRotate = true; }, 2500);
});

// ===== Lighting =====
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const purpleLight1 = new THREE.PointLight(0xa020f0, 6, 15);
purpleLight1.position.set(-4, 2, -3);
scene.add(purpleLight1);

const purpleLight2 = new THREE.PointLight(0x6a11cb, 6, 15);
purpleLight2.position.set(4, 1, -3);
scene.add(purpleLight2);

// ===== Load Laptop Model =====
const loader = new GLTFLoader();
let laptop;

// If the console log below reveals a flat backdrop/floor mesh,
// add its exact name here to hide it and exclude it from centering math.
const MESH_NAMES_TO_HIDE = []; // e.g. ['Object_4']

loader.load(
    './models/laptop.glb',
    function (gltf) {
        laptop = gltf.scene;

        // Log every mesh with readable size + world position
        laptop.traverse((child) => {
            if (child.isMesh) {
                child.geometry.computeBoundingBox();
                const size = new THREE.Vector3();
                child.geometry.boundingBox.getSize(size);

                const worldPos = new THREE.Vector3();
                child.getWorldPosition(worldPos);

                console.log(
                    `Mesh: ${child.name || '(unnamed)'} | size: x=${size.x.toFixed(2)} y=${size.y.toFixed(2)} z=${size.z.toFixed(2)} | worldPos: x=${worldPos.x.toFixed(2)} y=${worldPos.y.toFixed(2)} z=${worldPos.z.toFixed(2)}`
                );

                if (MESH_NAMES_TO_HIDE.includes(child.name)) {
                    child.visible = false;
                }
            }
        });

        scene.add(laptop);

        // ---- Bounding box from visible meshes only ----
        const box = new THREE.Box3();
        let hasAny = false;

        laptop.traverse((child) => {
            if (child.isMesh && child.visible) {
                child.geometry.computeBoundingBox();
                const meshBox = child.geometry.boundingBox.clone();
                meshBox.applyMatrix4(child.matrixWorld);
                if (!hasAny) {
                    box.copy(meshBox);
                    hasAny = true;
                } else {
                    box.union(meshBox);
                }
            }
        });

        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // Recenter model at the origin
        laptop.position.x -= center.x;
        laptop.position.y -= center.y;
        laptop.position.z -= center.z;

        // Auto-fit camera based on real model size
        const maxDim = Math.max(size.x, size.y, size.z);
        const fitDistance = maxDim * 1.8;

        camera.position.set(0, maxDim * 0.2, fitDistance);
        camera.near = maxDim / 100;
        camera.far = maxDim * 100;
        camera.updateProjectionMatrix();

        controls.target.set(0, 0, 0);
        controls.minDistance = maxDim * 0.6;
        controls.maxDistance = maxDim * 4;
        controls.update();

        console.log("Laptop loaded. Bounding size:", size, "Original center:", center);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },
    function (error) {
        console.error("Error loading model:", error);
    }
);

// ===== Animation Loop =====
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    if (laptop) {
        laptop.position.y += Math.sin(t * 1.2) * 0.0003;
    }

    purpleLight1.intensity = 5 + Math.sin(t * 2) * 1.5;
    purpleLight2.intensity = 5 + Math.cos(t * 2) * 1.5;

    controls.update();
    renderer.render(scene, camera);
}
animate();

// ===== Resize Window =====
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== Dark Mode Toggle =====
const modeToggle = document.getElementById('modeToggle');
const modeIcon = document.getElementById('modeIcon');

modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    modeIcon.textContent = isDark ? '☀️' : '🌙';
});

// ===== Floating Particles =====
const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 28;

for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.bottom = `-${Math.random() * 20}px`;
    particle.style.animationDuration = `${Math.random() * 10 + 8}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;

    particlesContainer.appendChild(particle);
}