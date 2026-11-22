/**
 * Quenq - Common Site Scripts
 * Handles global loader, pseudo-fullscreen safeguard, and ad mocks.
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

  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const container = document.querySelector('.app-container');

  if (fullscreenBtn && container) {
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
  }
});
