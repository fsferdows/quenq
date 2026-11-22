# Quenq - Open Source Web Preservation Platform

An open-source web preservation archive and simulator museum cloned from [quenq.com](https://quenq.com/) and open-sourced for developers and digital culture archivists.

Developed & Maintained by **[FS FERDOWS](https://github.com/fsferdows)**.

---

## 👨‍💻 Developer & Maintainer

- **Developer**: **FS FERDOWS**
- **GitHub Profile**: [@fsferdows](https://github.com/fsferdows)
- **Organization**: LateBright
- **Official Channel**: [FS Ferdows](https://youtube.com/@fsferdowsyt?si=03HdUXfd3jfuD0AZ)

---

## 🌟 Overview & Architecture

Quenq is an interactive digital preservation museum designed to showcase legacy web applications, browser-based emulators, and historical software artifacts directly in modern desktop and mobile browsers.

### Key Capabilities
- **Universal Web Emulation**: WebAssembly, Canvas, and HTML5 emulation pipelines running client-side with zero external plugins.
- **Retro Skeuomorphic Interface**: Authentic early-2000s desktop design system featuring custom gradient button bars, textured panels, and responsive layouts.
- **Dynamic Catalog Engine**: Real-time category filtering, instant client-side search, multi-page pagination, and local persistence for pinned favorites.
- **Custom Application Loader**: In-browser loader supporting local files and external web modules.
- **Telemetry & Tracker Free**: Cleaned of third-party trackers, ad scripts, and proprietary analytics for offline-capable deployment.

---

## 📂 Repository Layout

```
quenq/
├── index.html                    # Museum Entrance & Featured Showcase
├── arcade/                       # Interactive Web Games Catalog
├── apps/                         # System Simulators & Standalone Web Ports
├── directory/                    # Curated Web Exhibits & Museum Index
├── blog/                         # Digital Archives & Cultural Articles
├── about/                        # Project History & Mission
├── contact/                      # Preservation Inquiries
├── css/styles.css                # Full Retro Skeuomorphic Stylesheet
├── js/                           # Modular Client Engines (common, arcade, apps, directory)
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
The server automatically detects open ports and serves on `http://localhost:3000` (or `3001` if occupied).

### Run with Python
```bash
python3 -m http.server 3000
```

---

## 📄 License

This open-source project is distributed under the MIT License. Copyright (c) 2026 **FS FERDOWS**.
