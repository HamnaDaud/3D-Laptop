# 3D Laptop Viewer — XI Pulse

**Full Name:** Hamna Daud
**Applied Track/Domain:** Web Development Track
**Task Title:** Build a simple application that displays one interactive 3D object. 

---

## 📌 Overview

This project is an interactive 3D product viewer built for **XI Pulse**, showcasing a black ASUS laptop model. The user can freely rotate and zoom into the model, explore clickable hotspots linked to different sections of the laptop (Display, Performance, Design & Ports), and toggle between a light and neon dark mode: all wrapped in a purple, tech-themed UI matching the XI Pulse brand identity.

---

## 🛠️ Approach & Work Completed

The project was built incrementally on top of a basic Three.js laptop viewer, evolving into a polished, branded experience:

1. **Core 3D Viewer**
   - Loaded a `.glb` laptop model using `GLTFLoader`.
   - Implemented `OrbitControls` for rotate and zoom interactions, with auto-rotate that pauses on user interaction and resumes after a short idle period.
   - Removed default grid/axes helpers for a clean presentation.
   - Auto-centers the model and auto-fits the camera based on the model's real computed bounding box (using only visible meshes), so the object is reliably centered and appropriately zoomed regardless of the model's native scale/pivot.

2. **Branding & Theme**
   - Added a fixed top banner with the XI Pulse logo, title, and a live "model name" badge.
   - Applied a purple/violet tech theme throughout (buttons, tags, borders, glows).
   - Added a subtle animated grid overlay and a radial gradient background — soft purple glow in light mode, intensified neon purple glow with a faster pulse animation in dark mode.
   - Added floating ambient purple particles drifting across the screen for a tech atmosphere.

3. **Interactivity**
   - Built a **tabbed, interactive description card** (Overview / Display / Performance / Design) with animated content swapping, gradient-highlighted active tab, and a hover-triggered zoom/glow effect on the whole card.
   - Added **clickable 3D hotspot markers** that are projected from 3D world space onto 2D screen coordinates every frame, so they visually track the laptop as it rotates and zooms. Clicking a hotspot syncs the description card to the relevant tab, and vice versa.
   - Added a dark/light mode toggle button with an animated icon swap.
   - Added purple point-lights with subtle pulsing intensity, and a gentle idle bobbing animation on the model itself, for a "living" scene rather than a static render.

4. **Diagnostics**
   - Included console logging of every mesh's name, size, and world position on model load, to make it easy to identify and hide any unwanted meshes (e.g. stray backdrop/floor planes sometimes baked into downloaded `.glb` files).

---

## ⚠️ Assumptions, Limitations & Pending Work

- **Hotspot positions are estimated**, not derived from named parts in the model. Since the specific `.glb` file's internal geometry/pivot varies, hotspot coordinates (screen, keyboard, ports, front) are approximate multipliers of the model's bounding box and may need minor manual tuning to align pixel-perfectly with a different laptop model.
- **Model name and spec content are hardcoded** (e.g. "ASUS ROG Laptop" and its tab descriptions) rather than parsed dynamically from the `.glb` file's metadata, since most free `.glb` assets don't embed reliable descriptive metadata.
- **No build tooling/bundler dependency** beyond what's needed to serve Three.js modules (e.g. via a simple dev server or bundler of the developer's choice) — the project uses plain HTML/CSS/JS with ES module imports, not a framework like React/Next.js.
- **Single object only** — the app is scoped to displaying one 3D model at a time, per the task requirements; no model-switching UI was built.
- **Not tested across all `.glb` sources** — behavior (especially the auto-centering and mesh-hiding diagnostics) was designed generically, but different models with unusual geometry, multiple root nodes, or embedded backdrop meshes may need small adjustments (a `MESH_NAMES_TO_HIDE` array is provided for this purpose).
- **No automated testing** (unit/e2e) was implemented; verification was done manually in-browser.

---

## 🧰 Tools, Libraries & Assets Used

**Core Technologies**
- Tailwind CSS, JavaScript (ES Modules)
- [Three.js](https://threejs.org/) — 3D rendering engine
  - `GLTFLoader` — for loading the `.glb` laptop model
  - `OrbitControls` — for camera rotation/zoom/pan interaction

**3D Model**
- A freely available `laptop.glb` 3D model (black ASUS-style laptop)

**Design Assets**
- `xi-pulse-logo.png` — provided XI Pulse brand logo, used in the top banner

**Development Environment**
- Node.js / npm (for local dependency management, e.g. installing the `three` package)

**AI Tools**
- Claude (Anthropic) — used as a coding assistant to iteratively build, debug, and refine the application's structure, styling, animations, and interactivity based on incremental feedback and requirements.

---

## 📂 Project Structure

```
3D-Laptop/
│
├── models/
│   └── laptop.glb
│
├── images/
│   └── xi-pulse-logo.png
│
├── node_modules/
├── .gitignore
├── index.html
├── script.js
├── style.css
├── package.json
└── package-lock.json
```

---

## ▶️ How to Run

1. Ensure `node_modules` is installed (`npm install`).
2. Serve the project directory with a local dev server (e.g. `npx serve`, `npx vite`, or any static server that supports ES modules).
3. Open the served URL in a browser.
4. Drag to rotate, scroll to zoom, click hotspot markers or tabs to explore the laptop's features, and use the toggle in the top-right to switch between light and neon dark mode.