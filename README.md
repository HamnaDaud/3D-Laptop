# 3D Laptop Viewer — XI Pulse

**Full Name:** Hamna Daud

**Applied Track/Domain:** Web Development

**Task Title:** Build a Simple Application that Displays One Interactive 3D Object

## Project Overview

This project is an interactive 3D laptop viewer built using Three.js. It loads a `.glb` laptop model and allows users to rotate, zoom, and explore it using mouse controls. To create a more polished experience, I added XI Pulse branding, a light/dark mode, animated lighting, and interactive hotspots that display information about different parts of the laptop.

## Approach & Work Completed

- Loaded a 3D laptop model using `GLTFLoader`.
- Implemented `OrbitControls` for rotation and zoom.
- Auto-centered and scaled the model for a consistent viewing experience.
- Added XI Pulse branding, a responsive interface, and light/dark theme.
- Created clickable hotspots linked to laptop feature descriptions.
- Enhanced the scene with animations, lighting effects, and a modern tech-inspired background.

## Assumptions, Limitations & Pending Work

- Hotspot positions are manually estimated and may require adjustment for different laptop models.
- Laptop specifications and descriptions are hardcoded rather than read from the model.
- The application supports a single 3D model, as required by the task.
- Testing was performed manually; no automated tests were implemented.

## Tools, Libraries & Assets Used

### Technologies & Libraries
- Tailwind CSS
- JavaScript (ES Modules)
- Three.js
  - `GLTFLoader`
  - `OrbitControls`

### Development Tools
- Visual Studio Code
- Node.js
- npm
- Git & GitHub

### Assets
- Free `.glb` laptop model from Sketchfab
- XI Pulse logo (`xi-pulse-logo.png`) provided as part of the assignment

### AI Tools
- Claude (Anthropic) – used as a coding assistant during development.

### References
- Three.js Documentation: https://threejs.org/docs/
- Three.js Examples: https://threejs.org/examples/
- Sketchfab: https://sketchfab.com/
