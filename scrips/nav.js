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

    // ---------- Galería ----------
    const left = document.getElementById('flecha-izquierda');
    const right = document.getElementById('flecha-derecha');
    const strip = document.querySelector('.fotos-imagenes');

    if (strip) {
      strip.setAttribute('tabindex', '0');

      function step() { return Math.max(240, Math.floor(strip.clientWidth * 0.85)); }
      function canScrollLeft() { return strip.scrollLeft > 0; }
      function canScrollRight() { return strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1; }
      function updateArrows() {
        if (left) left.style.opacity = canScrollLeft() ? '1' : '0.45';
        if (right) right.style.opacity = canScrollRight() ? '1' : '0.45';
      }
      function scrollByDir(dir) {
        strip.scrollBy({ left: dir * step(), top: 0, behavior: 'smooth' });
        setTimeout(updateArrows, 300);
      }

      left?.addEventListener('click', () => scrollByDir(-1));
      right?.addEventListener('click', () => scrollByDir(1));
      strip.addEventListener('scroll', updateArrows);

      strip.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByDir(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); scrollByDir(1); }
      });

      strip.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          strip.scrollLeft += e.deltaY;
          updateArrows();
        }
      }, { passive: false });

      updateArrows();
    }
  });
})();
