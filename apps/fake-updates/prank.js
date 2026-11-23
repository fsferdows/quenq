/**
 * Fake Update Screens & BSOD Prank Engine
 * onlinegames.stream
 */

(function () {
  let timer = null;
  let cursorTimer = null;
  let currentPercent = 14;
  let activeOs = "win10";
  let isCrashed = false;

  const OS_TEMPLATES = {
    win10: {
      render: (pct) => `
        <div class="win10-spinner">
          <div></div><div></div><div></div><div></div><div></div>
        </div>
        <h1 style="font-size: 28px; font-weight: 300; margin-bottom: 12px; letter-spacing: -0.5px;">Working on updates <span id="prank-percent">${pct}%</span></h1>
        <div style="font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.85); margin-bottom: 6px;">Don't turn off your PC. This will take a while.</div>
        <div style="font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.65);">Your PC will restart several times</div>
        <div style="position: absolute; bottom: 20px; font-size: 12px; color: rgba(255,255,255,0.3);">(Press Enter or tap to trigger BSOD)</div>
      `,
      bsod: (pct) => `
        <div class="prank-screen prank-bsod-win10">
          <div style="font-size: 110px; line-height: 1; margin-bottom: 25px; font-weight: 300;">:(</div>
          <div style="font-size: 28px; font-weight: 300; line-height: 1.35; max-width: 820px; margin-bottom: 30px;">
            Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
          </div>
          <div style="font-size: 22px; font-weight: 300; margin-bottom: 35px;">
            ${pct}% complete
          </div>
          <div style="display: flex; gap: 24px; align-items: center;">
            <div style="width: 100px; height: 100px; background: #ffffff; padding: 6px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px;">
              <div style="background:#000;"></div><div style="background:#000;"></div><div></div><div style="background:#000;"></div><div style="background:#000;"></div>
              <div style="background:#000;"></div><div></div><div style="background:#000;"></div><div></div><div style="background:#000;"></div>
              <div></div><div style="background:#000;"></div><div style="background:#000;"></div><div style="background:#000;"></div><div></div>
              <div style="background:#000;"></div><div></div><div style="background:#000;"></div><div></div><div style="background:#000;"></div>
              <div style="background:#000;"></div><div style="background:#000;"></div><div></div><div style="background:#000;"></div><div style="background:#000;"></div>
            </div>
            <div style="font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.92);">
              For more information about this issue and possible fixes, visit https://windows.com/stopcode<br>
              If you call a support person, give them this info:<br>
              <strong>Stop code: CRITICAL_PROCESS_DIED</strong>
            </div>
          </div>
        </div>
      `
    },

    win8: {
      render: (pct) => `
        <div class="win10-spinner">
          <div></div><div></div><div></div><div></div><div></div>
        </div>
        <h1 style="font-size: 28px; font-weight: 300; margin-bottom: 12px;">Configuring Windows updates</h1>
        <div style="font-size: 20px; font-weight: 300; margin-bottom: 8px;"><span id="prank-percent">${pct}%</span> complete.</div>
        <div style="font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.8);">Do not turn off your computer.</div>
        <div style="position: absolute; bottom: 20px; font-size: 12px; color: rgba(255,255,255,0.3);">(Press Enter to trigger BSOD)</div>
      `,
      bsod: (pct) => `
        <div class="prank-screen prank-bsod-win10" style="background:#0072c6;">
          <div style="font-size: 100px; line-height: 1; margin-bottom: 25px;">:(</div>
          <div style="font-size: 26px; font-weight: 300; line-height: 1.35; max-width: 800px; margin-bottom: 30px;">
            Your PC ran into a problem that it couldn't handle, and now it needs to restart.
          </div>
          <div style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.85);">
            You can search for the error online: <strong>BAD_POOL_HEADER</strong>
          </div>
        </div>
      `
    },

    win7: {
      render: (pct) => `
        <div class="win7-orb"></div>
        <h2 style="font-size: 22px; font-weight: 400; margin-bottom: 10px; text-shadow: 0 1px 3px rgba(0,0,0,0.6);">Installing update <span id="prank-percent">${Math.min(35, Math.ceil(pct / 3))}</span> of 35...</h2>
        <div style="font-size: 14px; color: rgba(255,255,255,0.8); text-shadow: 0 1px 2px rgba(0,0,0,0.6);">Do not turn off or unplug your machine.</div>
        <div style="position: absolute; bottom: 20px; font-size: 12px; color: rgba(255,255,255,0.3);">(Press Enter to trigger BSOD)</div>
      `,
      bsod: () => `
        <div class="prank-screen prank-bsod-classic">
          <pre>
A problem has been detected and Windows has been shut down to prevent damage
to your computer.

DRIVER_IRQL_NOT_LESS_OR_EQUAL

If this is the first time you've seen this Stop error screen,
restart your computer. If this screen appears again, follow
these steps:

Check to make sure any new hardware or software is properly installed.
If this is a new installation, ask your hardware or software manufacturer
for any Windows updates you might need.

If problems continue, disable or remove any newly installed hardware
or software. Disable BIOS memory options such as caching or shadowing.
If you need to use Safe Mode to remove or disable components, restart
your computer, press F8 to select Advanced Startup Options, and then
select Safe Mode.

Technical information:

*** STOP: 0x000000D1 (0x0000000C, 0x00000002, 0x00000000, 0xF86B5A89)

*** gv3.sys - Address F86B5A89 base at F86B5000, DateStamp 3dd991eb
          </pre>
        </div>
      `
    },

    vista: {
      render: (pct) => `
        <div class="win7-orb" style="background: radial-gradient(circle at 35% 35%, #ffffff 0%, #00c6ff 50%, #0072ff 100%);"></div>
        <h2 style="font-size: 22px; font-weight: 300; margin-bottom: 10px;">Configuring updates: Stage 3 of 3 - <span id="prank-percent">${pct}%</span> complete.</h2>
        <div style="font-size: 14px; color: rgba(255,255,255,0.8);">Do not turn off your computer.</div>
        <div style="position: absolute; bottom: 20px; font-size: 12px; color: rgba(255,255,255,0.3);">(Press Enter to trigger BSOD)</div>
      `,
      bsod: () => OS_TEMPLATES.win7.bsod()
    },

    xp: {
      render: (pct) => `
        <div class="xp-top-band">
          <img src="/logo.svg" style="height: 32px; filter: brightness(10);" alt="Windows XP">
        </div>
        <div class="xp-center-content">
          <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Please wait...</div>
          <div style="font-size: 16px; margin-bottom: 15px;">Installing Windows Updates... <span id="prank-percent">${pct}%</span></div>
          <div style="font-size: 12px; color: #bed2ed;">Do not turn off or unplug your computer.</div>
          <div class="xp-progress-bar-container">
            <div class="xp-progress-blocks">
              <div class="xp-block"></div>
              <div class="xp-block"></div>
              <div class="xp-block"></div>
            </div>
          </div>
        </div>
        <div class="xp-bottom-band">
          <div style="font-size: 11px; color: #bed2ed;">Microsoft Windows XP Professional Service Pack 3</div>
        </div>
      `,
      bsod: () => `
        <div class="prank-screen prank-bsod-classic">
          <pre>
A problem has been detected and Windows has been shut down to prevent damage
to your computer.

The problem seems to be caused by the following file: UXTHEME.DLL

PAGE_FAULT_IN_NONPAGED_AREA

If this is the first time you've seen this Stop error screen,
restart your computer. If this screen appears again, follow
these steps:

Check to make sure any new hardware or software is properly installed.
If this is a new installation, ask your hardware or software manufacturer
for any Windows XP updates you might need.

Technical information:

*** STOP: 0x00000050 (0xFD3094C2, 0x00000001, 0xFBFE7617, 0x00000000)

*** UXTHEME.DLL - Address FDF23422 base at FDF24000, DateStamp 3d6dd67c
          </pre>
        </div>
      `
    },

    98: {
      render: (pct) => `
        <div class="win98-window">
          <div class="win98-titlebar">
            <span>Microsoft Windows 98 Setup</span>
            <span class="win98-close">✕</span>
          </div>
          <div class="win98-body">
            <div style="font-weight: bold; margin-bottom: 8px;">Preparing Windows 98 Second Edition...</div>
            <div style="margin-bottom: 12px; color: #333;">Copying system files to your hard drive. Please wait while setup completes.</div>
            <div>Progress: <span id="prank-percent">${pct}%</span> complete</div>
            <div class="win98-progress-track">
              <div class="win98-progress-fill" style="width: ${pct}%;"></div>
            </div>
            <div style="margin-top: 15px; font-size: 11px; color: #555;">Estimated time remaining: <strong>${Math.max(1, Math.round((100 - pct) / 3))} minutes</strong></div>
          </div>
        </div>
        <div style="position: absolute; bottom: 20px; font-size: 12px; color: rgba(255,255,255,0.4);">(Press Enter to trigger BSOD)</div>
      `,
      bsod: () => `
        <div class="prank-screen prank-bsod-classic" style="text-align: center; align-items: center; justify-content: center;">
          <div style="background: #000082; padding: 25px; border: 2px solid #ffffff; max-width: 700px;">
            <div style="background: #c0c0c0; color: #000082; font-weight: bold; display: inline-block; padding: 2px 10px; margin-bottom: 20px;">
              Windows
            </div>
            <p style="margin-bottom: 20px;">
              A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.<br>
              The current application will be terminated.
            </p>
            <p style="margin-bottom: 20px;">
              * Press any key to terminate the current application.<br>
              * Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.
            </p>
            <p>Press any key to continue _</p>
          </div>
        </div>
      `
    },

    apple: {
      render: (pct) => `
        <svg width="68" height="82" viewBox="0 0 170 170" fill="#ffffff" style="margin-bottom: 25px;">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.83-11.88-14.37-6.2-9.67-11-20.97-14.41-33.91-3.41-12.94-5.12-24.87-5.12-35.79 0-14.02 3.69-25.75 11.07-35.19 7.38-9.44 16.71-14.28 27.99-14.53 4.8 0 10.15 1.25 16.06 3.75 5.91 2.5 9.77 3.86 11.58 4.09 1.45-.23 5.42-1.64 11.91-4.24 6.5-2.59 12.06-3.74 16.69-3.45 13.91.86 24.87 6.13 32.89 15.82-12.09 7.37-18.01 17.51-17.75 30.43.27 10.3 4.29 18.9 12.07 25.8 7.78 6.9 16.92 10.74 27.42 11.53-2.17 6.72-4.8 13.43-7.88 20.14zM119.22 31.84c0-7.39 2.66-14.33 7.97-20.82 5.32-6.5 11.85-10.45 19.61-11.87.67 7.28-1.74 14.22-7.22 20.82-5.49 6.6-12.28 10.55-20.36 11.87z"/>
        </svg>
        <div class="apple-progress-track">
          <div class="apple-progress-bar" style="width: ${pct}%;"></div>
        </div>
        <div style="font-size: 13px; color: #8e8e93; font-weight: 400;">
          Installing software update... About <span id="prank-percent">${Math.max(1, Math.round((100 - pct) / 3))}</span> minutes remaining
        </div>
        <div style="position: absolute; bottom: 20px; font-size: 12px; color: rgba(255,255,255,0.25);">(Press Enter to trigger Kernel Panic)</div>
      `,
      bsod: () => `
        <div class="prank-screen prank-kernel-panic-mac">
          <div class="mac-panic-box">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#ffffff" style="margin-bottom: 15px; opacity: 0.9;">
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </svg>
            <p style="font-size: 15px; line-height: 1.5; margin-bottom: 12px; font-weight: 500;">
              You need to restart your computer. Hold down the Power button for several seconds or press the Restart button.
            </p>
            <p style="font-size: 13px; line-height: 1.4; color: rgba(255,255,255,0.7); margin-bottom: 10px;">
              Veuillez redémarrer votre ordinateur. Maintenez la touche de démarrage enfoncée pendant plusieurs secondes ou bien appuyez sur le bouton de réinitialisation.
            </p>
            <p style="font-size: 13px; line-height: 1.4; color: rgba(255,255,255,0.7);">
              Sie müssen Ihren Computer neu starten. Halten Sie die Einschalttaste einige Sekunden lang gedrückt oder drücken Sie die Neustart-Taste.
            </p>
          </div>
        </div>
      `
    },

    ubuntu: {
      render: (pct) => `
        <div style="font-size: 40px; font-weight: 300; margin-bottom: 8px;">ubuntu</div>
        <div style="font-size: 18px; color: #e95420; font-weight: 300; margin-bottom: 30px;">24.04 LTS</div>
        <div style="font-size: 16px; margin-bottom: 15px;">Applying system updates... <span id="prank-percent">${pct}%</span></div>
        <div class="ubuntu-dots">
          <div class="ubuntu-dot"></div>
          <div class="ubuntu-dot"></div>
          <div class="ubuntu-dot"></div>
          <div class="ubuntu-dot"></div>
          <div class="ubuntu-dot"></div>
        </div>
        <div style="position: absolute; bottom: 20px; font-size: 12px; color: rgba(255,255,255,0.3);">(Press Enter to trigger Kernel Panic)</div>
      `,
      bsod: () => `
        <div class="prank-screen" style="background:#000; color:#fff; font-family:monospace; text-align:left; align-items:flex-start; padding:30px;">
          <pre style="line-height:1.4; font-size:14px;">
[  128.491028] Kernel panic - not syncing: Fatal exception in interrupt
[  128.491030] CPU: 0 PID: 0 Comm: swapper/0 Not tainted 6.8.0-31-generic #31-Ubuntu
[  128.491032] Hardware name: Generic PC/System Product Name, BIOS 1.0.0 04/01/2024
[  128.491033] Call Trace:
[  128.491034]  &lt;IRQ&gt;
[  128.491035]  dump_stack_lvl+0x48/0x70
[  128.491037]  panic+0x31b/0x360
[  128.491039]  oops_end+0xd0/0xe0
[  128.491040]  no_context+0x180/0x2c0
[  128.491042]  do_page_fault+0x2a0/0x3e0
[  128.491044]  page_fault+0x1b/0x30
[  128.491045] RIP: 0010:native_queued_spin_lock_slowpath+0x1a2/0x2f0
[  128.491047] ---[ end Kernel panic - not syncing: Fatal exception in interrupt ]---
          </pre>
        </div>
      `
    },

    chromeos: {
      render: (pct) => `
        <div class="chrome-spinner"></div>
        <h2 style="font-size: 24px; font-weight: 400; margin-bottom: 12px;">Updating your device...</h2>
        <div style="font-size: 16px; color: #bdc1c6; margin-bottom: 8px;"><span id="prank-percent">${pct}%</span> complete</div>
        <div style="font-size: 13px; color: #9aa0a6;">Please do not turn off your device. This will only take a moment.</div>
        <div style="position: absolute; bottom: 20px; font-size: 12px; color: rgba(255,255,255,0.3);">(Press Enter to trigger Recovery Screen)</div>
      `,
      bsod: () => `
        <div class="prank-screen" style="background:#202124; color:#fff;">
          <div style="width:70px; height:70px; border-radius:50%; background:#ea4335; display:flex; align-items:center; justify-content:center; font-size:44px; font-weight:bold; margin-bottom:25px;">!</div>
          <h2 style="font-size:24px; font-weight:400; margin-bottom:12px;">Chrome OS is missing or damaged.</h2>
          <p style="font-size:15px; color:#bdc1c6; margin-bottom:25px; max-width:500px;">Please insert a recovery USB stick or SD card.</p>
          <div style="font-size:12px; color:#5f6368;">Model: SNOW FREMONT A-C 1234</div>
        </div>
      `
    }
  };

  const PrankEngine = {
    init: function (osType, containerId) {
      activeOs = osType || "win10";
      isCrashed = false;
      currentPercent = Math.floor(Math.random() * 25) + 12;

      const container = document.getElementById(containerId || "prank-content");
      if (!container) return;

      const tmpl = OS_TEMPLATES[activeOs] || OS_TEMPLATES.win10;
      container.innerHTML = tmpl.render(currentPercent);

      // Handle Fullscreen request
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }

      // Interval progress
      clearInterval(timer);
      timer = setInterval(() => {
        if (currentPercent < 99 && !isCrashed) {
          currentPercent += Math.floor(Math.random() * 3) + 1;
          const pEl = document.getElementById("prank-percent");
          if (pEl) {
            if (activeOs === "win7") {
              pEl.textContent = Math.min(35, Math.ceil(currentPercent / 3));
            } else if (activeOs === "apple") {
              pEl.textContent = Math.max(1, Math.round((100 - currentPercent) / 3));
              const fill = document.querySelector(".apple-progress-bar");
              if (fill) fill.style.width = currentPercent + "%";
            } else if (activeOs === "98") {
              pEl.textContent = currentPercent + "%";
              const fill = document.querySelector(".win98-progress-fill");
              if (fill) fill.style.width = currentPercent + "%";
            } else {
              pEl.textContent = currentPercent + "%";
            }
          }
        }
      }, 3500);

      // Setup cursor auto-hide
      const screenWrapper = document.getElementById("prank-wrapper") || container.parentElement;
      const exitBtn = document.getElementById("prank-exit-btn");

      const showCursor = () => {
        if (screenWrapper) screenWrapper.classList.remove("hide-cursor");
        if (exitBtn) exitBtn.classList.add("visible");
        clearTimeout(cursorTimer);
        cursorTimer = setTimeout(() => {
          if (screenWrapper && !isCrashed) screenWrapper.classList.add("hide-cursor");
          if (exitBtn) exitBtn.classList.remove("visible");
        }, 2200);
      };

      window.addEventListener("mousemove", showCursor);
      window.addEventListener("touchstart", showCursor);
      showCursor();

      // Keyboard & Click Triggers
      window.onkeydown = (e) => {
        if (e.key === "Escape") {
          PrankEngine.exit();
        } else if (e.key === "Enter" || e.key === " ") {
          PrankEngine.crash();
        }
      };

      container.onclick = () => {
        if (!isCrashed) {
          PrankEngine.crash();
        }
      };

      if (exitBtn) {
        exitBtn.onclick = (e) => {
          e.stopPropagation();
          PrankEngine.exit();
        };
      }
    },

    crash: function () {
      if (isCrashed) return;
      isCrashed = true;
      clearInterval(timer);

      const tmpl = OS_TEMPLATES[activeOs] || OS_TEMPLATES.win10;
      const screenWrapper = document.getElementById("prank-wrapper") || document.getElementById("prank-overlay");
      if (screenWrapper) {
        screenWrapper.classList.remove("hide-cursor");
        screenWrapper.innerHTML = `
          <button class="prank-exit-btn visible" id="prank-exit-btn" onclick="window.PrankEngine.exit()">✕ Exit Prank (Esc)</button>
          ${tmpl.bsod(currentPercent)}
        `;
      }
    },

    exit: function () {
      clearInterval(timer);
      clearTimeout(cursorTimer);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      // If we are on a standalone subpage, go back to /apps/fake-updates/
      if (window.location.pathname.includes('/fake-updates/') && !window.location.pathname.endsWith('/fake-updates/') && !window.location.pathname.endsWith('/fake-updates/index.html')) {
        window.location.href = '/apps/fake-updates/';
      } else {
        const overlay = document.getElementById("prank-overlay");
        if (overlay) overlay.style.display = "none";
      }
    }
  };

  window.PrankEngine = PrankEngine;
})();
