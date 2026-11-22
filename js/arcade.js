/**
 * Quenq Arcade - Game Grid & Interactive Filtering
 * Supports real-time search, genre filtering, pagination (50 items/page),
 * pinning games to localStorage, lazy-loading background images,
 * and loading custom SWF/HTML games into the browser.
 */

document.addEventListener('DOMContentLoaded', () => {
  const gameGrid = document.getElementById('game-grid');
  const searchBar = document.getElementById('search-bar');
  const genreFilterButtons = document.querySelectorAll('.genre-btn');
  const sidebarGenreLinks = document.querySelectorAll('#genre-nav-links .genre-sidebar-link');
  const noGamesMessage = document.getElementById('no-games-found');
  const noPinnedMessage = document.getElementById('no-pinned-found');
  const paginationContainer = document.getElementById('arcade-pagination');
  const addCustomBtn = document.getElementById('add-custom-game-btn');

  const gamesPerPage = 50;

  // Load custom saved games from localStorage
  const customGames = JSON.parse(localStorage.getItem('customArcadeGames') || '[]');
  customGames.forEach(cg => {
    const card = document.createElement('a');
    card.className = 'game-card';
    card.dataset.bg = cg.bg || '';
    card.dataset.gameGenre = cg.genre || 'arcade';
    card.dataset.gameId = cg.id;
    card.dataset.gameName = cg.name.toLowerCase();
    card.href = cg.url;
    if (cg.bg) card.style.backgroundImage = `url('${cg.bg}')`;
    card.innerHTML = `
      <h2>${cg.name}</h2>
      <span class="pin-button" title="Pin Game">
        <svg viewBox="0 0 24 24"><path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.5V22H12.5V16H18V14L16,12Z"></path></svg>
      </span>
    `;
    gameGrid.insertBefore(card, gameGrid.firstChild);
  });

  const gameCards = Array.from(document.querySelectorAll('#game-grid .game-card'));

  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      genre: urlParams.get('genre') || 'all',
      search: urlParams.get('search') || '',
      page: parseInt(urlParams.get('page'), 10) || 1
    };
  };

  let { genre: currentGenre, search: currentSearch, page: currentPage } = getUrlParams();
  let pinnedGames = JSON.parse(localStorage.getItem('pinnedGames')) || [];

  if (currentSearch && searchBar) {
    searchBar.value = currentSearch;
  }

  const buildNavUrl = (targetPage, targetGenre = currentGenre, targetSearch = currentSearch) => {
    const params = new URLSearchParams();
    if (targetGenre && targetGenre !== 'all') params.set('genre', targetGenre);
    if (targetSearch && targetSearch.trim() !== '') params.set('search', targetSearch.trim());
    if (targetPage > 1) params.set('page', targetPage);

    const queryString = params.toString();
    return window.location.pathname + (queryString ? '?' + queryString : '');
  };

  const lazyBackgroundObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        if (card.dataset.bg && !card.style.backgroundImage) {
          const bgUrl = card.dataset.bg.startsWith('http') ? card.dataset.bg : `https://static.quenq.com/${card.dataset.bg}`;
          card.style.backgroundImage = `url('${bgUrl}')`;
          observer.unobserve(card);
        }
      }
    });
  });

  const getPageNumbers = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  };

  const renderPaginationControls = (totalPages) => {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    if (currentPage > 1) {
      const prevBtn = document.createElement('a');
      prevBtn.className = 'action-btn';
      prevBtn.innerHTML = '&larr;';
      prevBtn.href = buildNavUrl(currentPage - 1);
      paginationContainer.appendChild(prevBtn);
    } else {
      const prevBtn = document.createElement('span');
      prevBtn.className = 'action-btn btn-disabled';
      prevBtn.innerHTML = '&larr;';
      paginationContainer.appendChild(prevBtn);
    }

    const pageRange = getPageNumbers(currentPage, totalPages);
    pageRange.forEach(page => {
      if (page === '...') {
        const span = document.createElement('span');
        span.className = 'pagination-ellipsis';
        span.textContent = '...';
        paginationContainer.appendChild(span);
      } else {
        const btn = document.createElement('a');
        btn.className = 'action-btn';
        if (page === currentPage) btn.classList.add('active');
        btn.textContent = page;
        btn.href = buildNavUrl(page);
        paginationContainer.appendChild(btn);
      }
    });

    if (currentPage < totalPages) {
      const nextBtn = document.createElement('a');
      nextBtn.className = 'action-btn';
      nextBtn.innerHTML = '&rarr;';
      nextBtn.href = buildNavUrl(currentPage + 1);
      paginationContainer.appendChild(nextBtn);
    } else {
      const nextBtn = document.createElement('span');
      nextBtn.className = 'action-btn btn-disabled';
      nextBtn.innerHTML = '&rarr;';
      paginationContainer.appendChild(nextBtn);
    }
  };

  const updateFiltersAndSort = () => {
    const matchedCards = gameCards.filter(card => {
      const searchMatch = currentSearch === '' || card.dataset.gameName.includes(currentSearch);

      let genreMatch = false;
      if (currentGenre === 'all') {
        genreMatch = true;
      } else if (currentGenre === 'pinned') {
        genreMatch = pinnedGames.includes(card.dataset.gameId);
      } else {
        genreMatch = card.dataset.gameGenre && card.dataset.gameGenre.includes(currentGenre);
      }

      return searchMatch && genreMatch;
    });

    matchedCards.sort((a, b) => a.dataset.gameName.localeCompare(b.dataset.gameName));

    if (noGamesMessage) noGamesMessage.style.display = 'none';
    if (noPinnedMessage) noPinnedMessage.style.display = 'none';

    if (matchedCards.length === 0) {
      if (currentGenre === 'pinned' && currentSearch === '') {
        if (noPinnedMessage) noPinnedMessage.style.display = 'block';
      } else {
        if (noGamesMessage) noGamesMessage.style.display = 'block';
      }
    }

    const totalGames = matchedCards.length;
    const totalPages = Math.ceil(totalGames / gamesPerPage);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;

    gameCards.forEach(card => card.style.display = 'none');

    matchedCards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = 'block';
        gameGrid.appendChild(card);
      }
    });

    genreFilterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.genre === currentGenre);
    });

    renderPaginationControls(totalPages);
  };

  const togglePin = (gameId, cardElement) => {
    const isPinned = pinnedGames.includes(gameId);
    if (isPinned) {
      pinnedGames = pinnedGames.filter(id => id !== gameId);
    } else {
      pinnedGames.push(gameId);
    }
    localStorage.setItem('pinnedGames', JSON.stringify(pinnedGames));

    gameCards.forEach(card => {
      card.classList.toggle('pinned', pinnedGames.includes(card.dataset.gameId));
    });

    updateFiltersAndSort();
  };

  gameCards.forEach(card => {
    lazyBackgroundObserver.observe(card);
    const gameId = card.dataset.gameId;
    card.classList.toggle('pinned', pinnedGames.includes(card.dataset.gameId));

    const pinButton = card.querySelector('.pin-button');
    if (pinButton) {
      pinButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePin(gameId, card);
      });
    }
  });

  if (searchBar) {
    searchBar.addEventListener('input', () => {
      currentSearch = searchBar.value.toLowerCase().trim();
      currentPage = 1;
      updateFiltersAndSort();
    });
  }

  genreFilterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentGenre = btn.dataset.genre;
      currentPage = 1;
      const newUrl = buildNavUrl(1, currentGenre);
      window.history.pushState({}, '', newUrl);
      updateFiltersAndSort();
    });
  });

  sidebarGenreLinks.forEach(link => {
    link.style.textTransform = 'capitalize';
  });

  // Custom Game Modal Handler
  if (addCustomBtn) {
    const modal = document.createElement('div');
    modal.id = 'custom-game-modal';
    modal.style.cssText = `
      display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.6); z-index: 99999; justify-content: center; align-items: center;
    `;
    modal.innerHTML = `
      <div style="background: #ece9d8; border: 3px solid #0055ea; border-radius: 6px 6px 0 0; width: 480px; max-width: 92%; box-shadow: 0 8px 24px rgba(0,0,0,0.5); font-family: Tahoma, sans-serif; overflow: hidden;">
        <div style="background: linear-gradient(180deg, #0058ee 0%, #3a93ff 8%, #0055ea 40%, #0045c4 88%, #0036a4 100%); color: #fff; padding: 6px 10px; font-weight: bold; font-size: 13px; display: flex; justify-content: space-between; align-items: center;">
          <span>🕹️ Quenq Game Loader — Add or Play Any Game</span>
          <button id="close-modal-btn" style="background: #c75050; color: #fff; border: 1px solid #fff; border-radius: 3px; font-weight: bold; cursor: pointer; padding: 0 6px;">✕</button>
        </div>
        <div style="padding: 16px; font-size: 13px; color: #333;">
          <p style="margin-top:0;">Load any custom Flash game (<strong>.SWF</strong>) or web game into your Quenq Arcade:</p>
          
          <div style="background: #fff; border: 1px solid #7f9db9; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
            <label style="font-weight: bold; display: block; margin-bottom: 6px;">Option 1: Play Local .SWF or .HTML File</label>
            <input type="file" id="swf-file-input" accept=".swf,.html" style="font-size: 12px; width: 100%;"/>
            <div id="player-mount-point" style="margin-top: 10px;"></div>
          </div>

          <div style="background: #fff; border: 1px solid #7f9db9; padding: 12px; border-radius: 4px;">
            <label style="font-weight: bold; display: block; margin-bottom: 6px;">Option 2: Add Web Game by URL</label>
            <input type="text" id="custom-game-name" placeholder="Game Name (e.g. Super Smash Flash)" style="width: 95%; margin-bottom: 8px; padding: 5px;"/>
            <input type="text" id="custom-game-url" placeholder="Play URL or Embed link" style="width: 95%; margin-bottom: 8px; padding: 5px;"/>
            <select id="custom-game-genre" style="width: 98%; margin-bottom: 10px; padding: 5px;">
              <option value="action">Action</option>
              <option value="adventure">Adventure</option>
              <option value="arcade">Arcade</option>
              <option value="puzzle">Puzzle</option>
              <option value="shooter">Shooter</option>
              <option value="racing">Racing</option>
              <option value="sports">Sports</option>
              <option value="strategy">Strategy</option>
            </select>
            <button id="save-custom-game-btn" class="action-btn" style="background: #2b78e4; color: #fff; font-weight: bold; border-color: #1a56a7; cursor: pointer; padding: 6px 14px;">Save to My Arcade</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    addCustomBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
    });

    modal.querySelector('#close-modal-btn').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // File input handler with Ruffle
    const fileInput = modal.querySelector('#swf-file-input');
    const mountPoint = modal.querySelector('#player-mount-point');

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;

      const fileUrl = URL.createObjectURL(file);
      if (file.name.endsWith('.swf')) {
        mountPoint.innerHTML = '<p style="color:#0055ea;">Loading Flash Game with Ruffle WebAssembly...</p>';
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@ruffle-rs/ruffle';
        script.onload = () => {
          mountPoint.innerHTML = '';
          const ruffle = window.RufflePlayer.newest();
          const player = ruffle.createPlayer();
          player.style.width = '100%';
          player.style.height = '320px';
          mountPoint.appendChild(player);
          player.load(fileUrl);
        };
        document.head.appendChild(script);
      } else {
        mountPoint.innerHTML = `<iframe src="${fileUrl}" style="width: 100%; height: 320px; border: 1px solid #999;"></iframe>`;
      }
    });

    // Save custom game to localStorage
    const saveBtn = modal.querySelector('#save-custom-game-btn');
    saveBtn.addEventListener('click', () => {
      const name = modal.querySelector('#custom-game-name').value.trim();
      const url = modal.querySelector('#custom-game-url').value.trim();
      const genre = modal.querySelector('#custom-game-genre').value;

      if (!name || !url) {
        alert('Please provide both Game Name and Play URL!');
        return;
      }

      const id = 'custom-' + Date.now();
      const customGames = JSON.parse(localStorage.getItem('customArcadeGames') || '[]');
      customGames.push({ id, name, url, genre });
      localStorage.setItem('customArcadeGames', JSON.stringify(customGames));

      alert(`"${name}" has been added to your Arcade! The page will now reload.`);
      window.location.reload();
    });
  }

  updateFiltersAndSort();
});
