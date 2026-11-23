/**
 * Quenq CrazyGames Arcade Engine
 * Inspired by https://www.crazygames.com/
 * Powers the 6,100+ game catalog, hero carousel, horizontal sliders,
 * live instant search, category filtering, and in-page theater player.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const searchInput = document.getElementById('arcade-search-input');
  const mainGrid = document.getElementById('main-arcade-grid');
  const countDisplay = document.getElementById('catalog-count-display');
  const gridTitle = document.getElementById('grid-header-title');
  const paginationContainer = document.getElementById('arcade-pagination');
  const pinnedCountElem = document.getElementById('pinned-count');
  const sidebar = document.getElementById('arcade-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle-btn');
  const randomGameBtn = document.getElementById('random-game-btn');
  const mobileSearchToggle = document.getElementById('mobile-search-toggle');
  const headerSearchContainer = document.getElementById('header-search-container');

  // Theater Player Elements
  const theaterModal = document.getElementById('theater-modal');
  const theaterIframe = document.getElementById('theater-iframe');
  const theaterTitle = document.getElementById('theater-game-title');
  const theaterCloseBtn = document.getElementById('theater-close-btn');
  const theaterFsBtn = document.getElementById('theater-fs-btn');
  const theaterShareBtn = document.getElementById('theater-share-btn');
  const theaterPopoutBtn = document.getElementById('theater-popout-btn');
  const theaterControlsBtn = document.getElementById('theater-controls-btn');
  const theaterVpad = document.getElementById('theater-virtual-gamepad');

  // Rows
  const gtaTrack = document.getElementById('gta-track');
  const trendingTrack = document.getElementById('trending-track');
  const drivingTrack = document.getElementById('driving-track');
  const flashTrack = document.getElementById('flash-track');

  // Catalog State
  let allGames = [];
  let currentGenre = 'all';
  let currentSearch = '';
  let currentPage = 1;
  const gamesPerPage = 48;
  let pinnedGames = JSON.parse(localStorage.getItem('pinnedGames') || '[]');

  // Known High-Res Local Thumbnail Registry
  const POPULAR_THUMB_MAP = {
    'gta-san-andreas': '/images/thumbnails/gta-san-andreas.jpg',
    'gta-vice-city': '/apps/vice-city/preview.jpg',
    'vice-city': '/apps/vice-city/preview.jpg',
    'gta-3': '/apps/gta-3/preview.jpg',
    'gta-5': '/images/thumbnails/gta-5.jpg',
    'gta-advance': '/images/thumbnails/gta-advance.jpg',
    'gta-1': '/images/thumbnails/gta-1.jpg',
    'gta-2': '/images/thumbnails/gta-2.jpg',
    'bully': '/images/thumbnails/bully.jpg',
    'midnight-club': '/images/thumbnails/midnight-club.jpg',
    'max-payne': '/images/thumbnails/max-payne.jpg',
    'slope': '/images/thumbnails/slope.jpg',
    'crossy-road': '/images/thumbnails/crossy-road.jpg',
    'bad-ice-cream': '/images/thumbnails/bad-ice-cream.jpg',
    'doom': '/images/thumbnails/doom.jpg',
    'doom-1993': '/images/thumbnails/doom.jpg',
    'flappy-bird': '/images/thumbnails/flappy-bird.jpg',
    'doodle-jump': '/images/thumbnails/doodle-jump.jpg',
    'cookie-clicker': '/images/thumbnails/cookie-clicker.jpg',
    'antbuster': '/images/thumbnails/antbuster.jpg',
    'sonic-on-angel-island': '/images/thumbnails/sonic.jpg',
    'ducklife': 'https://imgs.crazygames.com/ducklife.png?metadata=none&quality=85&width=540&resizer=covers',
    'ducklife-2': 'https://imgs.crazygames.com/ducklife2.png?metadata=none&quality=85&width=540&resizer=covers',
    'ducklife-4': 'https://imgs.crazygames.com/games/ducklife-4/cover-1583236005740.png?metadata=none&quality=85&width=540&resizer=covers',
    'pacman': 'https://imgs.crazygames.com/pacman.png?metadata=none&quality=85&width=540&resizer=covers',
    'bloxorz': 'https://imgs.crazygames.com/games/bloxorz/cover-1669373098527.png?metadata=none&quality=85&width=540&resizer=covers',
    '2048': 'https://imgs.crazygames.com/games/2048/cover_16x9-1707828856995.png?metadata=none&quality=85&width=540&resizer=covers'
  };

  // High-Resolution Procedural SVG Card Cover Generator (Zero 404s)
  function getProceduralThumbnail(name, genre) {
    const safeName = (name || 'Game').replace(/[<>&"']/g, '');
    const cleanGenre = (genre || 'arcade').toLowerCase();

    let hash = 0;
    for (let i = 0; i < safeName.length; i++) {
      hash = ((hash << 5) - hash) + safeName.charCodeAt(i);
      hash |= 0;
    }

    const themes = {
      gta: ['#200122', '#6f0000', '#f1c40f', '🚗'],
      driving: ['#1a0826', '#e65c00', '#f9d423', '🏎️'],
      action: ['#141E30', '#c0392b', '#e74c3c', '💥'],
      puzzle: ['#0f2027', '#203a43', '#00d2ff', '🧩'],
      sports: ['#0a192f', '#11998e', '#38ef7d', '🏀'],
      strategy: ['#1f1c2c', '#928DAB', '#ffd200', '👑'],
      multiplayer: ['#14052b', '#7047eb', '#a855f7', '⚔️'],
      simulation: ['#281404', '#d35400', '#f39c12', '🍪'],
      retro: ['#2b1055', '#7597de', '#47d7ff', '⚡'],
      arcade: ['#0b0e17', '#7047eb', '#47d7ff', '🕹️']
    };

    const themeKey = Object.keys(themes).find(k => cleanGenre.includes(k)) || 'arcade';
    const [c1, c2, accent, icon] = themes[themeKey];

    const words = safeName.split(/\s+/).filter(Boolean);
    const initials = words.slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'Q';
    const displayTitle = safeName.length > 22 ? safeName.substring(0, 20) + '...' : safeName;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="480" height="270">
      <defs>
        <linearGradient id="g_${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="60%" stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c1}"/>
        </linearGradient>
      </defs>
      <rect width="480" height="270" fill="url(#g_${Math.abs(hash)})"/>
      <circle cx="240" cy="100" r="44" fill="rgba(255,255,255,0.08)" stroke="${accent}" stroke-width="2"/>
      <text x="240" y="112" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">${initials}</text>
      <text x="240" y="180" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">${displayTitle}</text>
      <rect x="170" y="206" width="140" height="26" rx="13" fill="rgba(0,0,0,0.55)" stroke="${accent}" stroke-width="1"/>
      <text x="240" y="223" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="11" font-weight="700" fill="${accent}" text-anchor="middle" letter-spacing="1">${icon} ${themeKey.toUpperCase()}</text>
    </svg>`;

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // Grand Theft Auto & Rockstar Premier Collection
  const GTA_ROCKSTAR_COLLECTION = [
    { id: 'gta-san-andreas', name: 'GTA: San Andreas (3D)', genre: 'gta,action,driving', source: 'gta', thumb: '/images/thumbnails/gta-san-andreas.jpg', embedUrl: 'https://games.crazygames.com/en_US/mad-town-andreas-mafia-storie/index.html' },
    { id: 'gta-vice-city', name: 'GTA: Vice City Online', genre: 'gta,action,driving', source: 'gta', thumb: '/apps/vice-city/preview.jpg', embedUrl: 'https://vc.quenq.com' },
    { id: 'gta-3', name: 'GTA 3 (Grand Theft Auto III)', genre: 'gta,action,driving', source: 'gta', thumb: '/apps/gta-3/preview.jpg', embedUrl: 'https://iii.quenq.com' },
    { id: 'gta-5', name: 'GTA V (Los Santos 3D)', genre: 'gta,action,driving', source: 'gta', thumb: '/images/thumbnails/gta-5.jpg', embedUrl: 'https://games.crazygames.com/en_US/gangster-contract-mafia-wars/index.html' },
    { id: 'gta-advance', name: 'GTA Advance (Liberty City)', genre: 'gta,action,retro', source: 'gta', thumb: '/images/thumbnails/gta-advance.jpg', embedUrl: '/apps/gta-advance/' },
    { id: 'gta-2', name: 'Grand Theft Auto 2 (1999)', genre: 'gta,action,retro', source: 'gta', thumb: '/images/thumbnails/gta-2.jpg', embedUrl: '/apps/gta-2/' },
    { id: 'gta-1', name: 'Grand Theft Auto (1997)', genre: 'gta,action,retro', source: 'gta', thumb: '/images/thumbnails/gta-1.jpg', embedUrl: '/apps/gta-1/' },
    { id: 'bully', name: 'Bully (Bullworth Academy)', genre: 'gta,action,adventure', source: 'gta', thumb: '/images/thumbnails/bully.jpg', embedUrl: '/apps/bully/' },
    { id: 'midnight-club', name: 'Midnight Club: Street Racing', genre: 'gta,driving,racing', source: 'gta', thumb: '/images/thumbnails/midnight-club.jpg', embedUrl: '/apps/midnight-club/' },
    { id: 'gangster-contract-mafia-wars', name: 'Gangster Contract: Mafia Wars', genre: 'gta,action,driving', source: 'crazygames', thumb: 'https://imgs.crazygames.com/games/gangster-contract-mafia-wars/cover-1602145804014.png?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/gangster-contract-mafia-wars/index.html' },
    { id: 'free-rally-vice', name: 'Free Rally: Vice City Stunts', genre: 'gta,driving,multiplayer', source: 'crazygames', thumb: 'https://imgs.crazygames.com/free-rally-vice_16x9/20250210095941/free-rally-vice_16x9-cover?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/free-rally-vice/index.html' },
    { id: 'madalin-stunt-cars-2', name: 'Madalin Stunt Cars 2', genre: 'gta,driving,multiplayer', source: 'crazygames', thumb: 'https://imgs.crazygames.com/games/madalin-stunt-cars-2/cover_16x9-1695113654654.png?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/madalin-stunt-cars-2/index.html' }
  ];

  // Featured Blockbuster Definitions
  const FEATURED_HITS = [
    { id: 'gta-san-andreas', name: 'GTA: San Andreas (3D)', genre: 'gta,action,driving', thumb: '/images/thumbnails/gta-san-andreas.jpg', embedUrl: 'https://games.crazygames.com/en_US/mad-town-andreas-mafia-storie/index.html' },
    { id: 'gta-vice-city', name: 'GTA: Vice City Online', genre: 'gta,action,driving', thumb: '/apps/vice-city/preview.jpg', embedUrl: 'https://vc.quenq.com' },
    { id: 'moto-x3m', name: 'Moto X3M', genre: 'driving', thumb: 'https://imgs.crazygames.com/moto-x3m_16x9/20241004045353/moto-x3m_16x9-cover?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/moto-x3m/index.html' },
    { id: 'smash-karts', name: 'Smash Karts', genre: 'multiplayer', thumb: 'https://imgs.crazygames.com/smash-karts_16x9/20241004045353/smash-karts_16x9-cover?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/smash-karts/index.html' },
    { id: 'slope', name: 'Slope 3D', genre: 'driving', thumb: '/images/thumbnails/slope.jpg', embedUrl: '/apps/slope/' },
    { id: 'crossy-road', name: 'Crossy Road', genre: 'arcade', thumb: '/images/thumbnails/crossy-road.jpg', embedUrl: '/apps/crossy-road/' },
    { id: 'bad-ice-cream', name: 'Bad Ice-Cream', genre: 'puzzle', thumb: '/images/thumbnails/bad-ice-cream.jpg', embedUrl: '/apps/bad-ice-cream/' },
    { id: 'happy-wheels', name: 'Happy Wheels', genre: 'arcade', thumb: 'https://imgs.crazygames.com/happywheels.png?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/happy-wheels/index.html' },
    { id: 'bloxorz', name: 'Bloxorz', genre: 'puzzle', thumb: 'https://imgs.crazygames.com/games/bloxorz/cover-1669373098527.png?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/bloxorz/index.html' },
    { id: 'pacman', name: 'Pacman', genre: 'arcade', thumb: 'https://imgs.crazygames.com/pacman.png?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/pacman/index.html' },
    { id: 'space-invaders', name: 'Space Invaders', genre: 'arcade', thumb: 'https://imgs.crazygames.com/games/space-invaders/cover_16x9-1714708168967.png?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/space-invaders/index.html' },
    { id: 'geometry-dash-online', name: 'Geometry Dash', genre: 'action', thumb: 'https://imgs.crazygames.com/games/geometry-dash-online/cover-1587042571253.png?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/geometry-dash-online/index.html' },
    { id: 'cut-the-rope-ebx', name: 'Cut the Rope', genre: 'puzzle', thumb: 'https://imgs.crazygames.com/cut-the-rope-ebx_16x9/20241004045353/cut-the-rope-ebx_16x9-cover?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/cut-the-rope-ebx/index.html' },
    { id: 'ducklife-4', name: 'Duck Life 4', genre: 'sports', thumb: 'https://imgs.crazygames.com/games/ducklife-4/cover-1583236005740.png?metadata=none&quality=85&width=540&resizer=covers', embedUrl: 'https://games.crazygames.com/en_US/ducklife-4/index.html' },
    { id: 'gta-3', name: 'GTA 3 (Liberty City)', genre: 'gta,action,driving', thumb: '/apps/gta-3/preview.jpg', embedUrl: 'https://iii.quenq.com' },
    { id: 'gta-5', name: 'GTA V (3D Simulator)', genre: 'gta,action,driving', thumb: '/images/thumbnails/gta-5.jpg', embedUrl: 'https://games.crazygames.com/en_US/gangster-contract-mafia-wars/index.html' }
  ];

  const FLASH_CLASSICS = [
    { id: 'antbuster', name: 'Antbuster Defense', genre: 'strategy', thumb: '/images/thumbnails/antbuster.jpg', embedUrl: '/arcade/antbuster/' },
    { id: 'sonic-on-angel-island', name: 'Sonic on Angel Island', genre: 'action', thumb: '/images/thumbnails/sonic.jpg', embedUrl: '/arcade/sonic-on-angel-island/' },
    { id: 'feedme', name: 'Feed Me', genre: 'puzzle', thumb: '/images/thumbnails/bad-ice-cream.jpg', embedUrl: '/arcade/feedme/' },
    { id: 'epicbattlefantasy2', name: 'Epic Battle Fantasy 2', genre: 'action', thumb: '/images/thumbnails/antbuster.jpg', embedUrl: '/arcade/epicbattlefantasy2/' },
    { id: 'pandemic', name: 'Pandemic', genre: 'strategy', thumb: getProceduralThumbnail('Pandemic', 'strategy'), embedUrl: '/arcade/pandemic/' },
    { id: 'ufomania', name: 'UfoMania', genre: 'arcade', thumb: getProceduralThumbnail('UfoMania', 'arcade'), embedUrl: '/arcade/ufomania/' },
    { id: 'bear-in-the-big-blue-house-help-bear-bake', name: 'Bear in Big Blue House', genre: 'simulation', thumb: getProceduralThumbnail('Bear in Big Blue House', 'simulation'), embedUrl: '/arcade/bear-in-the-big-blue-house-help-bear-bake/' },
    { id: 'cow-and-chicken-ballet-parking', name: 'Ballet Parking', genre: 'driving', thumb: getProceduralThumbnail('Ballet Parking', 'driving'), embedUrl: '/arcade/cow-and-chicken-ballet-parking/' }
  ];

  // Lazy Thumbnail Observer
  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const img = card.querySelector('img');
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(card);
        }
      }
    });
  }, { rootMargin: '250px 0px' });

  // Update Pin Counter
  function updatePinCount() {
    if (pinnedCountElem) pinnedCountElem.textContent = pinnedGames.length;
  }
  updatePinCount();

  // Create Card Element
  function renderCard(game) {
    const card = document.createElement('div');
    card.className = 'cg-card';
    if (pinnedGames.includes(game.id)) card.classList.add('pinned');
    card.dataset.id = game.id;

    // Resolve robust thumbnail URL (Check map -> Check valid web thumb -> Procedural Fallback)
    let thumbUrl = POPULAR_THUMB_MAP[game.id] || null;
    if (!thumbUrl) {
      if (game.thumb && !game.thumb.includes('static.quenq.com') && !game.thumb.includes('thumbnails/')) {
        thumbUrl = game.thumb;
      } else {
        thumbUrl = getProceduralThumbnail(game.name, game.genre);
      }
    }

    card.innerHTML = `
      <img class="cg-card-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%23191f33'/%3E%3C/svg%3E" data-src="${thumbUrl}" alt="${game.name}" loading="lazy"/>
      <button class="cg-card-pin" title="Pin Game">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.5V22H12.5V16H18V14L16,12Z"></path></svg>
      </button>
      <div class="cg-card-overlay">
        <div class="cg-card-title">${game.name}</div>
        <div class="cg-card-tag">${game.genre ? game.genre.split(',')[0].toUpperCase() : 'ARCADE'}</div>
      </div>
    `;

    // Self-healing image onError safeguard
    const img = card.querySelector('.cg-card-img');
    if (img) {
      img.onerror = function() {
        this.onerror = null;
        this.src = getProceduralThumbnail(game.name, game.genre);
      };
    }

    // Click to Open Theater Player
    card.addEventListener('click', (e) => {
      if (e.target.closest('.cg-card-pin')) return;
      e.preventDefault();
      openTheaterGame(game);
    });

    // Pin Toggle
    const pinBtn = card.querySelector('.cg-card-pin');
    pinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isPinned = pinnedGames.includes(game.id);
      if (isPinned) {
        pinnedGames = pinnedGames.filter(id => id !== game.id);
        card.classList.remove('pinned');
      } else {
        pinnedGames.push(game.id);
        card.classList.add('pinned');
      }
      localStorage.setItem('pinnedGames', JSON.stringify(pinnedGames));
      updatePinCount();
      if (currentGenre === 'pinned') updateGrid();
    });

    lazyObserver.observe(card);
    return card;
  }

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // Mobile Search Toggle
  if (mobileSearchToggle && headerSearchContainer) {
    mobileSearchToggle.addEventListener('click', () => {
      headerSearchContainer.classList.toggle('mobile-search-active');
      if (headerSearchContainer.classList.contains('mobile-search-active')) {
        searchInput.focus();
      }
    });
  }

  // Open Theater Player
  function openTheaterGame(game) {
    if (!game) return;
    theaterTitle.textContent = game.name;
    const playerUrl = game.embedUrl || (game.id ? `/arcade/${game.id}/` : '#');
    theaterIframe.src = playerUrl;
    theaterPopoutBtn.href = playerUrl;
    theaterModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (isTouchDevice && window.innerWidth < 1024 && theaterVpad) {
      theaterVpad.style.display = 'flex';
      if (theaterControlsBtn) theaterControlsBtn.classList.add('primary');
    }
    window.history.pushState({ modalOpen: true }, '', `/arcade/${game.id}/`);
  }

  function closeTheater() {
    theaterModal.classList.remove('is-open');
    theaterIframe.src = 'about:blank';
    document.body.style.overflow = '';
    if (theaterVpad) theaterVpad.style.display = 'none';
    if (theaterControlsBtn) theaterControlsBtn.classList.remove('primary');
    window.history.pushState({}, '', '/arcade/');
  }

  theaterCloseBtn.addEventListener('click', closeTheater);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && theaterModal.classList.contains('is-open')) {
      closeTheater();
    }
  });

  theaterFsBtn.addEventListener('click', () => {
    const frame = document.getElementById('theater-frame-container');
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      if (frame.requestFullscreen) frame.requestFullscreen();
      else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
    }
  });

  theaterShareBtn.addEventListener('click', async () => {
    const shareData = { title: theaterTitle.textContent, text: 'Play ' + theaterTitle.textContent + ' free on Quenq Arcade!', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Game link copied to clipboard!');
      }
    } catch(e) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  });

  // Theater Touch Gamepad Controls
  if (theaterControlsBtn && theaterVpad) {
    theaterControlsBtn.addEventListener('click', () => {
      const isVis = theaterVpad.style.display !== 'none';
      theaterVpad.style.display = isVis ? 'none' : 'flex';
      theaterControlsBtn.classList.toggle('primary', !isVis);
    });

    function dispatchTheaterKey(type, btn) {
      const key = btn.dataset.key;
      const code = btn.dataset.code;
      const keyCode = parseInt(btn.dataset.keycode, 10);
      const eventInit = {
        key: key, code: code, keyCode: keyCode, which: keyCode, bubbles: true, cancelable: true, composed: true
      };
      const event = new KeyboardEvent(type, eventInit);
      document.dispatchEvent(event);
      window.dispatchEvent(event);
      if (theaterIframe && theaterIframe.contentWindow) {
        try {
          theaterIframe.contentWindow.dispatchEvent(new KeyboardEvent(type, eventInit));
        } catch (e) {}
      }
    }

    theaterVpad.querySelectorAll('.vpad-btn').forEach(btn => {
      const start = (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.add('vpad-active');
        dispatchTheaterKey('keydown', btn);
      };
      const end = (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.remove('vpad-active');
        dispatchTheaterKey('keyup', btn);
      };
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
      btn.addEventListener('touchcancel', end, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    });
  }

  // Populate Horizontal Tracks
  function populateTrack(trackElem, gameList) {
    if (!trackElem) return;
    trackElem.innerHTML = '';
    gameList.forEach(g => {
      trackElem.appendChild(renderCard(g));
    });
  }

  populateTrack(gtaTrack, GTA_ROCKSTAR_COLLECTION);
  populateTrack(trendingTrack, FEATURED_HITS);
  populateTrack(drivingTrack, [...GTA_ROCKSTAR_COLLECTION, ...FEATURED_HITS].filter(g => (g.genre && g.genre.includes('driving')) || ['moto-x3m', 'smash-karts', 'slope', 'crossy-road'].includes(g.id)));
  populateTrack(flashTrack, FLASH_CLASSICS);

  // Row Slider Scroll Navigation Buttons
  document.querySelectorAll('.cg-slider-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const track = document.getElementById(targetId);
      if (!track) return;
      const amount = track.clientWidth * 0.75;
      track.scrollBy({ left: btn.classList.contains('prev-btn') ? -amount : amount, behavior: 'smooth' });
    });
  });

  // Hero Carousel Logic
  const slides = document.querySelectorAll('.cg-hero-slide');
  const dots = document.querySelectorAll('.cg-dot');
  let currentSlide = 0;
  let carouselTimer = null;

  function setSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() {
    setSlide((currentSlide + 1) % slides.length);
  }

  function startCarousel() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(nextSlide, 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      setSlide(parseInt(dot.dataset.index, 10));
      startCarousel();
    });
  });
  startCarousel();

  document.querySelectorAll('.hero-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const slug = btn.dataset.slug;
      const name = btn.dataset.name;
      const hit = FEATURED_HITS.find(h => h.id === slug) || { id: slug, name: name };
      openTheaterGame(hit);
    });
  });

  // Random Game Button
  if (randomGameBtn) {
    randomGameBtn.addEventListener('click', () => {
      if (allGames.length > 0) {
        const randomIndex = Math.floor(Math.random() * allGames.length);
        openTheaterGame(allGames[randomIndex]);
      } else {
        const randomIndex = Math.floor(Math.random() * FEATURED_HITS.length);
        openTheaterGame(FEATURED_HITS[randomIndex]);
      }
    });
  }

  // Sidebar Toggle for Mobile
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Pagination Controls
  function renderPagination(totalCount) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalCount / gamesPerPage);
    if (totalPages <= 1) return;

    if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'cg-nav-btn';
      prevBtn.innerHTML = '‹ Prev';
      prevBtn.addEventListener('click', () => {
        currentPage--;
        updateGrid();
        window.scrollTo({ top: mainGrid.offsetTop - 100, behavior: 'smooth' });
      });
      paginationContainer.appendChild(prevBtn);
    }

    const maxButtons = 7;
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let p = startPage; p <= endPage; p++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `cg-nav-btn ${p === currentPage ? 'primary' : ''}`;
      pageBtn.textContent = p;
      const pageNum = p;
      pageBtn.addEventListener('click', () => {
        currentPage = pageNum;
        updateGrid();
        window.scrollTo({ top: mainGrid.offsetTop - 100, behavior: 'smooth' });
      });
      paginationContainer.appendChild(pageBtn);
    }

    if (currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'cg-nav-btn';
      nextBtn.innerHTML = 'Next ›';
      nextBtn.addEventListener('click', () => {
        currentPage++;
        updateGrid();
        window.scrollTo({ top: mainGrid.offsetTop - 100, behavior: 'smooth' });
      });
      paginationContainer.appendChild(nextBtn);
    }
  }

  // Main Grid Update
  function updateGrid() {
    const query = currentSearch.toLowerCase().trim();

    const filtered = allGames.filter(game => {
      const matchSearch = query === '' || game.name.toLowerCase().includes(query) || game.id.includes(query);

      let matchGenre = false;
      if (currentGenre === 'all') {
        matchGenre = true;
      } else if (currentGenre === 'pinned') {
        matchGenre = pinnedGames.includes(game.id);
      } else if (currentGenre === 'crazygames') {
        matchGenre = game.source === 'crazygames';
      } else if (currentGenre === 'flash') {
        matchGenre = game.source === 'flash';
      } else if (currentGenre === 'gta') {
        matchGenre = game.source === 'gta' || (game.genre && (game.genre.includes('gta') || game.id.includes('gta') || game.name.toLowerCase().includes('gta') || game.name.toLowerCase().includes('grand theft') || game.name.toLowerCase().includes('vice city') || game.name.toLowerCase().includes('san andreas') || game.name.toLowerCase().includes('gangster') || game.name.toLowerCase().includes('mafia')));
      } else {
        matchGenre = game.genre && game.genre.includes(currentGenre);
      }

      return matchSearch && matchGenre;
    });

    // Update Counts & Headers
    countDisplay.textContent = `Showing ${Math.min(filtered.length, gamesPerPage)} of ${filtered.length} games`;
    gridTitle.textContent = currentSearch
      ? `Search results for "${currentSearch}" (${filtered.length})`
      : currentGenre === 'all' ? '🎮 All Games' : currentGenre === 'gta' ? '🚗 Grand Theft Auto & Rockstar Classics' : `Filtered: ${currentGenre.toUpperCase()}`;

    // Slice for current page
    const startIndex = (currentPage - 1) * gamesPerPage;
    const pageItems = filtered.slice(startIndex, startIndex + gamesPerPage);

    mainGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    pageItems.forEach(game => {
      fragment.appendChild(renderCard(game));
    });
    mainGrid.appendChild(fragment);

    renderPagination(filtered.length);
  }

  // Filter Selection Handler
  function selectGenre(genre) {
    currentGenre = genre;
    currentPage = 1;

    // Update sidebar items
    document.querySelectorAll('.cg-nav-item[data-genre]').forEach(el => {
      el.classList.toggle('active', el.dataset.genre === genre);
    });

    // Update pill tags
    document.querySelectorAll('.cg-tag-pill[data-genre]').forEach(el => {
      el.classList.toggle('active', el.dataset.genre === genre);
    });

    // On mobile, close sidebar after clicking
    if (window.innerWidth < 980 && sidebar) {
      sidebar.classList.remove('mobile-open');
    }

    updateGrid();
  }

  document.querySelectorAll('[data-genre]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      selectGenre(el.dataset.genre);
    });
  });

  // Search Input Listener
  let searchDebounce = null;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        currentSearch = searchInput.value;
        currentPage = 1;
        updateGrid();
      }, 120);
    });

    // Hotkey: press '/' to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // Load Combined Catalog (GTA & Rockstar Collection + Featured Hits + Flash Classics)
  allGames = [...GTA_ROCKSTAR_COLLECTION, ...FEATURED_HITS, ...FLASH_CLASSICS];
  updateGrid();

  Promise.all([
    fetch('/crazygames-catalog.json').then(r => r.json()).catch(() => []),
    fetch('/flash-catalog.json').then(r => r.json()).catch(() => [])
  ]).then(([cgCatalog, flashCatalog]) => {
    const existingIds = new Set(allGames.map(g => g.id));
    
    // Add Flash Preservation Classics
    flashCatalog.forEach(fg => {
      if (!existingIds.has(fg.id)) {
        allGames.push(fg);
        existingIds.add(fg.id);
      }
    });

    // Add CrazyGames HTML5 Catalog
    cgCatalog.forEach(cg => {
      if (!existingIds.has(cg.id)) {
        allGames.push(cg);
        existingIds.add(cg.id);
      }
    });

    console.log(`[Quenq CrazyGames] Total catalog ready: ${allGames.length} games.`);
    updateGrid();
  }).catch(err => {
    console.warn('Could not load game catalogs:', err);
  });

  // Support URL Query Parameters (?genre=gta, ?search=gta)
  const urlParams = new URLSearchParams(window.location.search);
  const paramGenre = urlParams.get('genre');
  const paramSearch = urlParams.get('search');
  if (paramGenre) {
    selectGenre(paramGenre);
  } else if (paramSearch) {
    if (searchInput) searchInput.value = paramSearch;
    currentSearch = paramSearch;
    updateGrid();
  }

  // Check if a direct game was requested in the URL path (e.g. /arcade/moto-x3m/)
  const currentPath = window.location.pathname;
  const match = currentPath.match(/^\/arcade\/([a-zA-Z0-9_\-]+)\/?$/);
  if (match && match[1] && match[1] !== 'index') {
    const slug = match[1];
    setTimeout(() => {
      const targetGame = allGames.find(g => g.id === slug) || { id: slug, name: slug.replace(/-/g, ' ').toUpperCase() };
      openTheaterGame(targetGame);
    }, 300);
  }
});
