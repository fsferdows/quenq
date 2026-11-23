/**
 * onlinegames.stream Directory - Web Ports & Digital Exhibits Launcher
 * Opens interactive museum items and web ports in centered desktop popups.
 */

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.directory-card');

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (card.target === '_blank' || card.getAttribute('target') === '_blank') {
        return;
      }
      e.preventDefault();
      const url = card.getAttribute('data-url');
      if (!url) return;

      const width = 960;
      const height = 540;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);

      window.open(
        url,
        '_blank',
        `location=no,resizable=yes,height=${height},width=${width},scrollbars=yes,status=no,top=${top},left=${left}`
      );
    });
  });
});
