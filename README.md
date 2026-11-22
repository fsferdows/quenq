# Quenq - Interactive Museum of Internet Culture

A high-fidelity reconstruction and web preservation archive of **[Quenq](https://quenq.com/)**, recreated using the **[REA (Reverse Engineer Anything)](https://github.com/morluto/rea.git)** skill and methodology.

## 🌟 Reconstructed Routes

1. **Home (`/`)** &mdash; [index.html](file:///Users/user/Desktop/quenq/index.html)
   - Retro Windows XP / early-2000s skeuomorphic museum interface.
   - Reborn XP Windows simulator hero showcase.
   - Featured interactive web simulators & ports (Project I.G.I., GTA 3, Dr. Driving, Vice City, Space Cadet Pinball, Fake Updates).
   - Top classic Flash game highlights.
   - Fresh from the Archives retro articles.
   - Dynamic quick links and community widgets.

2. **The Flash Arcade (`/arcade/`)** &mdash; [arcade/index.html](file:///Users/user/Desktop/quenq/arcade/index.html)
   - Complete library of **1,316+ classic Flash games** preserved.
   - Real-time client-side search across all titles.
   - 14 genre filter categories (*Action, Adventure, Arcade, Creative, Educational, Logic, Platformer, Puzzle, Quiz, Racing, Shooter, Simulation, Sports, Strategy*).
   - Fast pagination (50 games/page) with full navigation controls.
   - LocalStorage game pinning system (pin favorite games with star/pin badges).
   - Performance-optimized `IntersectionObserver` lazy-loading for game thumbnail art.
   - Dynamic game player fallback & pre-built featured players (`/arcade/follow/`, `/arcade/pandemic/`, `/arcade/antbuster/`, etc.).

3. **The Apps Library (`/apps/`)** &mdash; [apps/index.html](file:///Users/user/Desktop/quenq/apps/index.html)
   - High-fidelity preservation of retro simulators and web ports:
     - **Reborn XP** (Full Windows XP web emulator with persistent filesystem)
     - **Project I.G.I.** (2000 tactical stealth shooter web edition)
     - **Dr. Driving** (Full WebAssembly web port with keyboard/touch controls)
     - **GTA 3 & Vice City** (3D web ports)
     - **Minecraft** (Classic web edition)
     - **3D Pinball: Space Cadet** (Decompiled WebAssembly engine)
     - **Hill Climb Racing** (Original physics driving port)
     - **Diamond Rush** (2006 Gameloft mobile classic)
     - **Macintosh Classic (vMac)** (System 7 Apple emulator)
     - **Hacker Simulator**, **SWF Player**, **Fake Updates**, **Angry Birds Chrome**, **Console Emulator**
   - Fullscreen & pseudo-fullscreen responsive viewport controls.
   - Dynamic randomized recommendation engine for sidebar exhibits.

4. **The Directory (`/directory/`)** &mdash; [directory/index.html](file:///Users/user/Desktop/quenq/directory/index.html)
   - Curated index of premier external web ports, classic games, and digital exhibits:
     - The Simpsons: Hit & Run (WASM)
     - Call of Duty: Black Ops 1 Zombies (vel.gg)
     - Skate 3 Web Port
     - Counter-Strike 1.6 Web (play-cs.com)
     - Quake 3 Arena Web Port
     - LEGO Island Web Port
     - 3D Interactive Phone Museum
     - Noclip.website 3D Video Game Map Explorer
     - Neal.fun Internet Artifacts & PointerPointer
     - GTA V & Soundboards
   - Centered popup window launcher (960×540) mimicking classic desktop web utilities.

5. **Additional Preserved Pages:**
   - **Archives / Blog (`/blog/`)**
   - **About the Museum (`/about/`)**
   - **Contact & Preservation Submissions (`/contact/`)**

---

## 🛠️ Project Structure

```
quenq/
├── index.html                    # Root Home Page (https://quenq.com/)
├── arcade/
│   ├── index.html                # Flash Arcade (1,316+ games)
│   └── [game-id]/index.html      # Individual Game Player pages
├── apps/
│   ├── index.html                # Apps & Simulators Directory
│   ├── reborn-xp/index.html      # Windows XP Simulator
│   ├── dr-driving/index.html     # Dr. Driving Port
│   ├── project-igi/index.html    # Project IGI Port
│   └── [other-apps]/index.html   # 15 App Simulator Pages
├── directory/
│   └── index.html                # Web Ports & Digital Exhibits Directory
├── blog/
│   └── index.html                # Archives & Culture Articles
├── about/
│   └── index.html                # Museum Story & Mission
├── contact/
│   └── index.html                # Contact Information
├── css/
│   └── styles.css                # Full Retro Skeuomorphic Stylesheet
├── js/
│   ├── common.js                 # Global Loader & Fullscreen Safeguards
│   ├── arcade.js                 # Search, Genre Filter, Pinning, Pagination
│   ├── apps.js                   # Dynamic App Recommendations & Catalog
│   └── directory.js              # Centered Modal/Popup Window Launcher
├── theme/                        # Preserved Skeuomorphic Theme Graphics
├── images/                       # App previews, directory art, blog thumbnails
├── server.js                     # Zero-dependency Node.js Development Server
└── package.json
```

---

## 🚀 Running the Site

### Option 1: Built-in Node.js Server (Recommended)
No external dependencies required:
```bash
npm start
# or
node server.js
```
Then visit:
- **Home**: [http://localhost:3000/](http://localhost:3000/)
- **Arcade**: [http://localhost:3000/arcade/](http://localhost:3000/arcade/)
- **Apps**: [http://localhost:3000/apps/](http://localhost:3000/apps/)
- **Directory**: [http://localhost:3000/directory/](http://localhost:3000/directory/)

### Option 2: Python HTTP Server
```bash
python3 -m http.server 3000
```

### Option 3: Static Hosting / CDN
All assets are relative and compatible with Cloudflare Pages, Netlify, Vercel, or GitHub Pages.

---

## 🔬 REA Reverse Engineering Highlights

- **Ad & Telemetry Sanitization**: Third-party Google Funding Choices, AdSense banners, and analytics trackers were removed, replacing ad containers with clean, period-accurate preservation notices and museum badges without distorting the retro layout.
- **Dynamic Routing & Player Fallback**: `server.js` dynamically routes any `/arcade/:gameId` to an emulated Flash player using the preserved Ruffle CDN or Quenq Static CDN endpoints.
- **Preserved Responsive Skeuomorphism**: Authentic early-2000s desktop browser experience with modern mobile touch and viewport adaptivity.
