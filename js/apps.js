/**
 * Quenq Apps - Dynamic Apps Recommendation & Filtering
 */

(function () {
  const allApps = [
    { name: "GTA: San Andreas", url: "/apps/gta-san-andreas/" },
    { name: "GTA 3", url: "/apps/gta-3/" },
    { name: "Vice City", url: "/apps/vice-city/" },
    { name: "GTA V", url: "/apps/gta-5/" },
    { name: "GTA Advance", url: "/apps/gta-advance/" },
    { name: "Grand Theft Auto (1997)", url: "/apps/gta-1/" },
    { name: "Grand Theft Auto 2", url: "/apps/gta-2/" },
    { name: "Bully", url: "/apps/bully/" },
    { name: "Midnight Club", url: "/apps/midnight-club/" },
    { name: "Project I.G.I.", url: "/apps/project-igi/" },
    { name: "Minecraft", url: "/apps/minecraft/" },
    { name: "Reborn XP", url: "/apps/reborn-xp/" },
    { name: "Dr. Driving", url: "/apps/dr-driving/" },
    { name: "Hill Climb Racing", url: "/apps/hill-climb-racing/" },
    { name: "Diamond Rush", url: "/apps/diamond-rush/" },
    { name: "3D Pinball", url: "/apps/3d-pinball-space-cadet/" },
    { name: "Console Emulator", url: "/apps/emulator/" },
    { name: "SWF Player", url: "/apps/swf-player/" },
    { name: "Macintosh Classic", url: "/apps/minivmac/" },
    { name: "Hacker Simulator", url: "/apps/hacker-simulator/" },
    { name: "Angry Birds Chrome", url: "/apps/angry-birds-chrome/" },
    { name: "Fake Updates", url: "/apps/fake-updates/" },
    { name: "Flappy Bird", url: "/apps/flappy-bird/" },
    { name: "2048", url: "/apps/2048/" },
    { name: "Doodle Jump", url: "/apps/doodle-jump/" },
    { name: "Cookie Clicker", url: "/apps/cookie-clicker/" },
    { name: "DOOM (1993)", url: "/apps/doom/" },
    { name: "Rickroller", url: "/apps/rickroller/" }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.replace(/\/+$/, "");

    const availableApps = allApps.filter(app => {
      const appPath = app.url.replace(/\/+$/, "");
      return !currentPath.includes(appPath);
    });

    for (let i = availableApps.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableApps[i], availableApps[j]] = [availableApps[j], availableApps[i]];
    }

    const selectedApps = availableApps.slice(0, 5);
    const listContainer = document.getElementById('dynamic-apps-list');

    if (listContainer) {
      let html = '';
      selectedApps.forEach(app => {
        html += `<li><a href="${app.url}">${app.name}</a></li>`;
      });
      listContainer.innerHTML = html;
    }
  });
})();
