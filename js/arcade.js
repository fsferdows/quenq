/**
 * Quenq Arcade - Game Grid & Interactive Filtering
 * Supports real-time search, genre filtering, pagination (50 items/page),
 * pinning games to localStorage, and lazy-loading background images.
 */

document.addEventListener('DOMContentLoaded', () => {
  const gameGrid = document.getElementById('game-grid');
  const searchBar = document.getElementById('search-bar');
  const genreFilterButtons = document.querySelectorAll('.genre-btn');
  const sidebarGenreLinks = document.querySelectorAll('#genre-nav-links .genre-sidebar-link');
  const gameCards = Array.from(document.querySelectorAll('#game-grid .game-card'));
  const noGamesMessage = document.getElementById('no-games-found');
  const noPinnedMessage = document.getElementById('no-pinned-found');
  const paginationContainer = document.getElementById('arcade-pagination');

  const gamesPerPage = 50;

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
        if (card.dataset.bg) {
          card.style.backgroundImage = `url('https://static.quenq.com/${card.dataset.bg}')`;
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

  updateFiltersAndSort();
});
