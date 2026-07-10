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

// ===== Model name badge in banner =====
const modelNameText = document.getElementById('modelNameText');

// ===== Spec/Tab Content =====
const SPEC_DATA = {
    overview: {
        title: 'ASUS ROG Laptop',
        text: 'A sleek matte-black powerhouse built for performance and style. Precision-crafted aluminum chassis meets serious gaming muscle underneath.',
        tags: ['Matte Black', 'Aluminum Body', 'RGB Keyboard']
    },
    display: {
        title: 'Display',
        text: 'A vivid, high-refresh panel with slim bezels for maximum screen-to-body ratio — sharp text, punchy color, and smooth motion for gaming or creative work.',
        tags: ['High Refresh', 'Slim Bezel', 'Anti-Glare']
    },
    performance: {
        title: 'Performance',
        text: 'Powered by the latest-gen processor and discrete graphics, with advanced cooling to keep clock speeds high even under sustained load.',
        tags: ['Discrete GPU', 'Fast Cooling', 'High Clock Speed']
    },
    design: {
        title: 'Design & Ports',
        text: 'A full suite of connectivity built into a slim aluminum frame — USB-C, HDMI, and fast Wi-Fi, all wrapped in a durable matte-black finish.',
        tags: ['USB-C', 'HDMI', 'Wi-Fi 6']
    }
};

// ===== Hotspots (positions estimated relative to model size) =====
// offset is a multiplier of maxDim, applied around the recentered origin.
// Adjust these once you see where they land on your specific model.
const HOTSPOTS = [
    { tab: 'display',     offset: new THREE.Vector3(0, 0.35, -0.15) },   // screen area
    { tab: 'performance', offset: new THREE.Vector3(0, 0.02, 0.15) },    // keyboard/body
    { tab: 'design',      offset: new THREE.Vector3(0.42, 0, 0) },       // side ports
    { tab: 'overview',    offset: new THREE.Vector3(0, -0.08, 0.35) }    // front/logo
];

const hotspotContainer = document.getElementById('hotspots');
const hotspotEls = [];
let modelMaxDim = 1;

function buildHotspots() {
    HOTSPOTS.forEach((spot) => {
        const el = document.createElement('div');
        el.classList.add('hotspot');
        el.dataset.tab = spot.tab;
        el.addEventListener('click', () => setActiveTab(spot.tab));
        hotspotContainer.appendChild(el);
        hotspotEls.push({ el, worldPos: spot.offset.clone().multiplyScalar(modelMaxDim) });
    });
}

function toScreenPosition(vector3) {
    const widthHalf = renderer.domElement.clientWidth / 2;
    const heightHalf = renderer.domElement.clientHeight / 2;
    const pos = vector3.clone().project(camera);
    return {
        x: (pos.x * widthHalf) + widthHalf,
        y: -(pos.y * heightHalf) + heightHalf,
        visible: pos.z < 1
    };
}

function updateHotspotPositions() {
    hotspotEls.forEach(({ el, worldPos }) => {
        const screenPos = toScreenPosition(worldPos);
        el.style.left = `${screenPos.x}px`;
        el.style.top = `${screenPos.y}px`;
        el.style.display = screenPos.visible ? 'block' : 'none';
    });
}

// ===== Tab / Card Logic =====
const descTitle = document.getElementById('descTitle');
const descText = document.getElementById('descText');
const descTags = document.getElementById('descTags');
const tabButtons = document.querySelectorAll('.tab-btn');

function setActiveTab(tabId) {
    const data = SPEC_DATA[tabId];
    if (!data) return;

    // update card content with a small fade-swap animation
    descTitle.textContent = data.title;
    descText.classList.remove('fade-swap');
    void descText.offsetWidth; // restart animation
    descText.classList.add('fade-swap');
    descText.textContent = data.text;

    descTags.innerHTML = '';
    data.tags.forEach((tag) => {
        const span = document.createElement('span');
        span.classList.add('tag');
        span.textContent = tag;
        descTags.appendChild(span);
    });

    // sync tab buttons
    tabButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // sync hotspot markers
    hotspotEls.forEach(({ el }) => {
        el.classList.toggle('active', el.dataset.tab === tabId);
    });
}

tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
});

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
        modelNameText.textContent = 'ASUS ROG Laptop';

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
        modelMaxDim = maxDim;
        const fitDistance = maxDim * 1.8;

        camera.position.set(0, maxDim * 0.2, fitDistance);
        camera.near = maxDim / 100;
        camera.far = maxDim * 100;
        camera.updateProjectionMatrix();

        controls.target.set(0, 0, 0);
        controls.minDistance = maxDim * 0.6;
        controls.maxDistance = maxDim * 4;
        controls.update();

        // Now that we know the model's real size, place the hotspots
        buildHotspots();
        setActiveTab('overview');

        console.log("Laptop loaded. Bounding size:", size, "Original center:", center);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },
    function (error) {
        console.error("Error loading model:", error);
        modelNameText.textContent = 'Failed to load model';
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
    updateHotspotPositions();
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