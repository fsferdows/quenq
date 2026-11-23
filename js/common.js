/**
 * Quenq - Common Site Scripts & Mobile Gamepad Engine
 * Handles global loader, pseudo-fullscreen safeguard, ad mocks,
 * and universal on-screen touch gamepad for mobile/tablet retro gaming.
 */

// Global ad stub so external ad references fail silently
window.adsbygoogle = window.adsbygoogle || [];

// Prevent default jump for placeholder action buttons
document.addEventListener('click', function (e) {
  const btn = e.target.closest('#fullscreen-btn, .action-btn[href="#"]');
  if (btn) {
    e.preventDefault();
  }
}, true);

document.addEventListener('DOMContentLoaded', function () {
  // Hide global loader smoothly
  const loader = document.getElementById('global-loader');
  if (loader) {
    setTimeout(function () {
      loader.classList.add('loader-hidden');
    }, 250);
  }

  // Fullscreen & Pseudo-Fullscreen Handler
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const container = document.querySelector('.app-container');
  const playerControls = document.querySelector('.player-controls');

  if (container) {
    let exitBtn = container.querySelector('.pseudo-exit-btn');
    if (!exitBtn) {
      exitBtn = document.createElement('button');
      exitBtn.className = 'pseudo-exit-btn';
      exitBtn.setAttribute('type', 'button');
      exitBtn.setAttribute('aria-label', 'Exit Fullscreen');
      exitBtn.setAttribute('title', 'Exit Fullscreen');
      exitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      container.appendChild(exitBtn);
    }

    function togglePseudoFullscreen(enable) {
      const active = (typeof enable === 'boolean') ? enable : !container.classList.contains('is-pseudo-fullscreen');
      if (active) {
        container.classList.add('is-pseudo-fullscreen');
        document.documentElement.classList.add('pseudo-fullscreen-active');
        document.body.classList.add('pseudo-fullscreen-active');
      } else {
        container.classList.remove('is-pseudo-fullscreen');
        document.documentElement.classList.remove('pseudo-fullscreen-active');
        document.body.classList.remove('pseudo-fullscreen-active');
      }
    }

    exitBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      togglePseudoFullscreen(false);
    });

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const target = container.querySelector('iframe') || container;

        if (isIOS || !document.fullscreenEnabled) {
          togglePseudoFullscreen();
          return;
        }

        if (document.fullscreenElement || document.webkitFullscreenElement) {
          if (document.exitFullscreen) { document.exitFullscreen(); }
          else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
          return;
        }

        const req = target.requestFullscreen || target.webkitRequestFullscreen || target.msRequestFullscreen;
        if (req) {
          try {
            const promise = req.call(target);
            if (promise && promise.catch) {
              promise.catch(function () {
                togglePseudoFullscreen(true);
              });
            }
          } catch (err) {
            togglePseudoFullscreen(true);
          }
        } else {
          togglePseudoFullscreen(true);
        }

        if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
          navigator.keyboard.lock(['Escape']).catch(function () {});
        }
      });
    }

    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if ('keyboard' in navigator && 'unlock' in navigator.keyboard) {
          navigator.keyboard.unlock();
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && container.classList.contains('is-pseudo-fullscreen')) {
        togglePseudoFullscreen(false);
      }
    });

    // ==========================================
    // Universal Mobile Virtual Gamepad Injection
    // ==========================================
    const vpad = document.createElement('div');
    vpad.className = 'virtual-gamepad';
    vpad.id = 'virtual-gamepad';
    vpad.innerHTML = `
      <div class="vpad-dpad">
        <button type="button" class="vpad-btn vpad-up" data-key="ArrowUp" data-code="ArrowUp" data-keycode="38">▲</button>
        <button type="button" class="vpad-btn vpad-left" data-key="ArrowLeft" data-code="ArrowLeft" data-keycode="37">◀</button>
        <div class="vpad-center"></div>
        <button type="button" class="vpad-btn vpad-right" data-key="ArrowRight" data-code="ArrowRight" data-keycode="39">▶</button>
        <button type="button" class="vpad-btn vpad-down" data-key="ArrowDown" data-code="ArrowDown" data-keycode="40">▼</button>
      </div>
      <div class="vpad-utility">
        <button type="button" class="vpad-btn vpad-util-btn" data-key="Enter" data-code="Enter" data-keycode="13">ENTER</button>
        <button type="button" class="vpad-btn vpad-util-btn" data-key="Space" data-code="Space" data-keycode="32">SPACE</button>
      </div>
      <div class="vpad-actions">
        <button type="button" class="vpad-btn vpad-action-btn vpad-btn-blue" data-key="z" data-code="KeyZ" data-keycode="90">Z</button>
        <button type="button" class="vpad-btn vpad-action-btn vpad-btn-green" data-key="x" data-code="KeyX" data-keycode="88">X</button>
        <button type="button" class="vpad-btn vpad-action-btn" data-key=" " data-code="Space" data-keycode="32">A</button>
        <button type="button" class="vpad-btn vpad-action-btn vpad-btn-yellow" data-key="Enter" data-code="Enter" data-keycode="13">B</button>
      </div>
    `;
    container.appendChild(vpad);

    // Add Toggle Controls Button in Player Controls
    if (playerControls) {
      let ctrlBtn = document.getElementById('toggle-controls-btn');
      if (!ctrlBtn) {
        ctrlBtn = document.createElement('a');
        ctrlBtn.id = 'toggle-controls-btn';
        ctrlBtn.className = 'action-btn';
        ctrlBtn.href = '#';
        ctrlBtn.innerHTML = `
          <svg viewBox="0 0 24 24"><path d="M17,6H7A6,6 0 0,0 1,12A6,6 0 0,0 7,18H17A6,6 0 0,0 23,12A6,6 0 0,0 17,6M17,16H7A4,4 0 0,1 3,12A4,4 0 0,1 7,8H17A4,4 0 0,1 21,12A4,4 0 0,1 17,16M6,13H8V15H9V13H11V12H9V10H8V12H6V13M15.5,12A1.5,1.5 0 0,1 17,13.5A1.5,1.5 0 0,1 15.5,15A1.5,1.5 0 0,1 14,13.5A1.5,1.5 0 0,1 15.5,12M18.5,9A1.5,1.5 0 0,1 20,10.5A1.5,1.5 0 0,1 18.5,12A1.5,1.5 0 0,1 17,10.5A1.5,1.5 0 0,1 18.5,9Z"></path></svg>
          <span id="controls-btn-text">Controls</span>
        `;
        playerControls.insertBefore(ctrlBtn, playerControls.firstChild);
      }

      ctrlBtn.addEventListener('click', function (e) {
        e.preventDefault();
        vpad.classList.toggle('is-visible');
        ctrlBtn.classList.toggle('active', vpad.classList.contains('is-visible'));
      });

      // Auto-show gamepad on mobile and touch tablets
      if (isTouchDevice && window.innerWidth < 1024) {
        vpad.classList.add('is-visible');
        ctrlBtn.classList.add('active');
      }
    }

    // Synthetic Keyboard Dispatcher
    function dispatchSyntheticKey(type, btn) {
      const key = btn.dataset.key;
      const code = btn.dataset.code;
      const keyCode = parseInt(btn.dataset.keycode, 10);

      const eventInit = {
        key: key,
        code: code,
        keyCode: keyCode,
        which: keyCode,
        bubbles: true,
        cancelable: true,
        composed: true
      };

      const event = new KeyboardEvent(type, eventInit);
      document.dispatchEvent(event);
      window.dispatchEvent(event);

      // Dispatch directly to active element or iframe
      const iframe = container.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.dispatchEvent(new KeyboardEvent(type, eventInit));
        } catch (e) {}
      }
    }

    vpad.querySelectorAll('.vpad-btn').forEach(btn => {
      const start = (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.add('vpad-active');
        dispatchSyntheticKey('keydown', btn);
      };
      const end = (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.remove('vpad-active');
        dispatchSyntheticKey('keyup', btn);
      };

      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
      btn.addEventListener('touchcancel', end, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    });
  }
});
