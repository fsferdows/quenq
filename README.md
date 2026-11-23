# Quenq - Open Source Web Preservation & 6,000+ Game Archive

An open-source web preservation archive and simulator museum cloned from [quenq.com](https://quenq.com/) and supercharged with **6,100+ playable games** (integrated from [CrazyGames](https://www.crazygames.com/) via the REA reverse-engineering methodology, plus classic Flash and standalone HTML5 apps). Fully responsive across mobile phones, tablets, laptops, and desktop PCs.

Developed & Maintained by **[FS FERDOWS](https://github.com/fsferdows)**.

---

## 👨‍💻 Developer & Maintainer

- **Developer**: **FS FERDOWS**
- **GitHub Profile**: [@fsferdows](https://github.com/fsferdows)
- **Organization**: LateBright
- **Official Channel**: [FS Ferdows](https://youtube.com/@fsferdowsyt?si=03HdUXfd3jfuD0AZ)

---

## 🌟 Key Features & Capabilities

- **6,100+ Playable Games**:
  - **4,800+ CrazyGames HTML5 Titles**: Moto X3M, Smash Karts, Happy Wheels, Bloxorz, Pacman, Space Invaders, Cut the Rope, Duck Life series, and more.
  - **1,300+ Classic Flash Games**: Preserved with WebAssembly Ruffle direct execution.
  - **Standalone Zero-Dependency Web Apps**: Crossy Road, Slope 3D, Bad Ice-Cream, DOOM (1993), Flappy Bird, 2048, Doodle Jump, Cookie Clicker, Hacker Simulator, SWF Player, and Console Emulator.
- **Universal Mobile & Tablet Responsiveness**:
  - Seamless layout scaling across small mobile screens (320px–480px), large smartphones (640px), tablets (768px–1024px), laptops, and high-res desktop monitors.
  - Touch-scrollable responsive navigation bar.
- **Universal On-Screen Virtual Gamepad**:
  - Automatically activates on touch devices with D-Pad and Action buttons (A, B, Z, X, Start, Select).
  - Dispatches full synthetic keyboard events directly to game runtimes so keyboard-driven games can be played on mobile.
- **Zero Broken Games Guarantee**:
  - Built-in alias resolution and automatic fallback between WebAssembly, iframe embeds, and native canvas apps.
- **Interactive Game Loader**:
  - Drag-and-drop any local `.swf` or `.html` file, or save custom web game URLs directly into local storage.
- **Telemetry & Tracker Free**:
  - Cleaned of all third-party tracking, invasive ads, and analytics for pure, privacy-first preservation.

---

## 📂 Repository Layout

```
quenq/
├── index.html                    # Museum Entrance & Featured Showcase
├── arcade/                       # Interactive Web Games Catalog (6,100+ Titles)
├── apps/                         # System Simulators & Standalone Web Ports
│   ├── crossy-road/              # Playable HTML5 Hopper
│   ├── slope/                    # Playable 3D Neon Ball Runner
│   ├── bad-ice-cream/            # Playable Ice-Blowing Grid Arcade
│   ├── flappy-bird/              # Standalone Canvas Physics Game
│   ├── 2048/                     # Sliding Tile Puzzle
│   ├── doodle-jump/              # Canvas Vertical Jumper
│   ├── cookie-clicker/           # Incremental Bakery Game
│   ├── doom/                     # 1993 id Software WASM Port
│   ├── swf-player/               # In-Browser Flash Drag & Drop Player
│   ├── hacker-simulator/         # Realistic Cyberpunk Terminal Simulator
│   ├── emulator/                 # Retro Multi-Console Canvas Emulator
│   └── fake-updates/             # Authentic Fullscreen OS Prank Simulator
├── directory/                    # Curated Web Exhibits & Museum Index
├── blog/                         # Digital Archives & Cultural Articles
├── about/                        # Project History & Mission
├── contact/                      # Preservation Inquiries
├── css/styles.css                # Responsive Retro Skeuomorphic Stylesheet
├── js/                           # Modular Engines (common, arcade, apps, directory)
├── crazygames-catalog.json       # Extracted 4,800+ CrazyGames Metadata
├── theme/                        # Preserved Skeuomorphic Theme Assets
├── images/                       # Exhibit Previews & Graphics
├── server.js                     # Zero-Dependency Node.js Server
└── package.json
```

---

## 🚀 Quick Start

### Run with Node.js
```bash
npm start
# or: node server.js
```
The server automatically starts on `http://localhost:3000` (or `3001` if occupied).

### API Endpoints
- Search or filter CrazyGames catalog:
  `GET /api/crazygames?q=moto&genre=driving&page=1&limit=20`

---

## 📄 License

This open-source project is distributed under the MIT License. Copyright (c) 2026 **FS FERDOWS**.
