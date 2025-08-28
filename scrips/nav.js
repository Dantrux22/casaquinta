// =====================================
// NAV responsive (drop-down bajo header)
// - Toggle con aria-expanded
// - Cierra al clickear un link o con ESC
// - Marca link activo por sección (IntersectionObserver)
// - Galería: flechas/teclado/wheel
// =====================================
(function () {
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn)}

  ready(() => {
    // ---------- Menú ----------
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nave-1');

    function openMenu() {
      navMenu.classList.add('show');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      navMenu.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu() {
      navMenu.classList.contains('show') ? closeMenu() : openMenu();
    }

    if (menuToggle && navMenu) {
      menuToggle.setAttribute('aria-controls', 'nav-menu');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.addEventListener('click', toggleMenu);

      // Cerrar con ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('show')) closeMenu();
      });
    }

    // Cerrar al hacer click en un link
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // ---------- Link activo por sección ----------
    const anchors = Array.from(navLinks);
    const targets = anchors
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    function setActive(hrefId) {
      anchors.forEach(a => {
        const isActive = a.getAttribute('href') === hrefId;
        a.classList.toggle('active', isActive);
        if (isActive) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    }

    if ('IntersectionObserver' in window && targets.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(`#${e.target.id}`); });
      }, { rootMargin: "-30% 0px -60% 0px", threshold: 0.01 });
      targets.forEach(t => io.observe(t));
    }

      updateArrows();
  });
})();
