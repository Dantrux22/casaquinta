/* Galería robusta: preview + modal con pestañas + visor
   - Abre modal mostrando SIEMPRE todas las fotos (grilla con scroll)
   - Soporta 1, 2, 3 o N fotos (sin romper el mosaico)
   - Pestaña de videos con mensaje si no hay
*/
(() => {
  'use strict';

  const DBG = (...args) => console.info('[galeria]', ...args);
  const OOPS = (...args) => console.error('[galeria][ERROR]', ...args);

  document.addEventListener('DOMContentLoaded', () => {
    try {
      const root = document.getElementById('galeria');
      if (!root) return DBG('No hay #galeria en la página (no inicializo).');

      const parseList = (str) => {
        if (!str) return [];
        try { return JSON.parse(str); } catch (e) {
          OOPS('JSON inválido en data-*: ', e, str);
          return [];
        }
      };
      const $  = (sel, ctx=document) => ctx.querySelector(sel);
      const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

      // Datos: primero intento data-*, si no, levanto del preview
      let fotos = parseList(root.dataset.fotos);
      if (!fotos.length) {
        fotos = $$('.gal-item img', root).map(i => i.getAttribute('src')).filter(Boolean);
      }
      let videos = parseList(root.dataset.videos);

      if (!fotos.length) {
        OOPS('No hay imágenes para mostrar. Revisá data-fotos o las rutas <img> del preview.');
        return;
      }
      DBG(`Encontradas ${fotos.length} foto(s) y ${videos?.length || 0} video(s).`);

      // Estado modal/visor
      let overlay, panelFotos, panelVideos, view, viewImg, viewCaption, btnPrev, btnNext, btnCloseX;
      let tabFotosBtn, tabVideosBtn;
      let currentIndex = 0;

      function buildOverlay() {
        if (overlay) return;

        overlay = document.createElement('div');
        overlay.className = 'gal-overlay';
        overlay.id = 'gal-overlay';
        overlay.innerHTML = `
          <div class="gal-wrap" role="dialog" aria-modal="true" aria-label="Galería">
            <div class="gal-head">
              <div class="gal-tabs">
                <button type="button" class="gal-tab gal-tab-active" data-tab="fotos">Fotos</button>
                <button type="button" class="gal-tab" data-tab="videos">Videos</button>
              </div>
              <button type="button" class="gal-close" aria-label="Cerrar">✕</button>
            </div>

            <div class="gal-body">
              <div class="gal-photos is-active" id="gal-photos"></div>
              <div class="gal-videos" id="gal-videos"></div>

              <div class="gal-view" aria-hidden="true" id="gal-view">
                <button type="button" class="gal-x" aria-label="Cerrar visor">✕</button>
                <button type="button" class="gal-arrow prev" aria-label="Anterior">‹</button>
                <img class="gal-view-img" alt="" />
                <button type="button" class="gal-arrow next" aria-label="Siguiente">›</button>
                <div class="gal-caption"></div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);

        // cache nodos
        panelFotos   = $('#gal-photos', overlay);
        panelVideos  = $('#gal-videos', overlay);
        view         = $('#gal-view', overlay);
        viewImg      = $('.gal-view-img', view);
        viewCaption  = $('.gal-caption', view);
        btnPrev      = $('.gal-arrow.prev', view);
        btnNext      = $('.gal-arrow.next', view);
        btnCloseX    = $('.gal-x', view);
        tabFotosBtn  = $('.gal-tab[data-tab="fotos"]', overlay);
        tabVideosBtn = $('.gal-tab[data-tab="videos"]', overlay);

        renderPhotosPanel();
        renderVideosPanel();

        // Eventos overlay
        $('.gal-close', overlay).addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });

        // Tabs
        tabFotosBtn.addEventListener('click', () => activateTab('fotos'));
        tabVideosBtn.addEventListener('click', () => activateTab('videos'));

        // Visor
        btnPrev.addEventListener('click', prev);
        btnNext.addEventListener('click', next);
        btnCloseX.addEventListener('click', closeViewer);

        // Teclado
        document.addEventListener('keydown', (e) => {
          if (!overlay || !overlay.classList.contains('is-open')) return;
          if (e.key === 'Escape') {
            if (view.classList.contains('open')) closeViewer(); else closeOverlay();
          } else if (e.key === 'ArrowLeft' && view.classList.contains('open')) {
            prev();
          } else if (e.key === 'ArrowRight' && view.classList.contains('open')) {
            next();
          }
        });
      }

      function activateTab(which) {
        if (which === 'fotos') {
          panelFotos.classList.add('is-active');
          panelVideos.classList.remove('is-active');
          tabFotosBtn.classList.add('gal-tab-active');
          tabVideosBtn.classList.remove('gal-tab-active');
          closeViewer();
        } else {
          panelVideos.classList.add('is-active');
          panelFotos.classList.remove('is-active');
          tabVideosBtn.classList.add('gal-tab-active');
          tabFotosBtn.classList.remove('gal-tab-active');
          closeViewer();
        }
      }

      // Crea un tile seguro (sólo si existe esa foto)
      function mkTile(idx, cls='') {
        if (idx < 0 || idx >= fotos.length) return null;
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = `tile ${cls}`.trim();
        tile.dataset.idx = String(idx);
        tile.innerHTML = `<img src="${fotos[idx]}" alt="Foto ${idx+1}">`;
        tile.addEventListener('click', () => openViewer(idx));
        return tile;
      }

      function renderPhotosPanel() {
        // Mosaico superior
        const mosaic = document.createElement('div');
        mosaic.className = 'gal-photos-mosaic';

        const main = mkTile(0, 'main');
        const topR = mkTile(1, 'top-right');

        if (main) mosaic.appendChild(main);
        if (topR) mosaic.appendChild(topR);

        const colRight = document.createElement('div');
        colRight.className = 'col-right';
        const t2 = mkTile(2);
        const t3 = mkTile(3);
        if (t2) colRight.appendChild(t2);
        if (t3) colRight.appendChild(t3);

        // Sólo agrego la col-right si tiene algo
        if (colRight.children.length) mosaic.appendChild(colRight);

        // Grilla con TODAS las fotos (0..n-1) — así te asegurás que se vean todas
        const rest = document.createElement('div');
        rest.className = 'gal-photos-rest';
        for (let i = 0; i < fotos.length; i++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'gal-thumb-all';
          b.dataset.idx = String(i);
          b.innerHTML = `<img src="${fotos[i]}" alt="Foto ${i+1}">`;
          b.addEventListener('click', () => openViewer(i));
          rest.appendChild(b);
        }

        panelFotos.innerHTML = '';
        // Si había 1 sola foto, igual muestro mosaico (con 1) + rest
        panelFotos.appendChild(mosaic);
        panelFotos.appendChild(rest);
      }

      function renderVideosPanel() {
        panelVideos.innerHTML = '';
        if (!videos || !videos.length) {
          panelVideos.innerHTML = `<div class="gal-empty">No hay videos disponibles por el momento.</div>`;
          return;
        }
        const grid = document.createElement('div');
        grid.className = 'gal-videos-grid';
        videos.forEach((src) => {
          const v = document.createElement('video');
          v.src = src;
          v.controls = true;
          v.playsInline = true;
          v.style.width = '100%';
          grid.appendChild(v);
        });
        panelVideos.appendChild(grid);
      }

      function openOverlay(startIdx=0) {
        buildOverlay();
        overlay.classList.add('is-open');
        document.documentElement.style.overflow = 'hidden';
        activateTab('fotos');
        closeViewer();

        // intento centrar el scroll en la miniatura elegida
        requestAnimationFrame(() => {
          const thumb = overlay.querySelector(`.gal-photos-rest .gal-thumb-all[data-idx="${startIdx}"]`)
                   || overlay.querySelector(`.gal-photos-mosaic .tile[data-idx="${startIdx}"]`);
          thumb?.scrollIntoView({behavior:'smooth', block:'nearest', inline:'nearest'});
        });
      }
      function closeOverlay() {
        if (!overlay) return;
        closeViewer();
        overlay.classList.remove('is-open');
        document.documentElement.style.overflow = '';
      }

      // Visor grande
      function openViewer(idx) {
        if (!view) return;
        currentIndex = clampIndex(idx);
        updateViewer();
        view.classList.add('open');
        view.setAttribute('aria-hidden', 'false');
      }
      function closeViewer() {
        if (!view) return;
        view.classList.remove('open');
        view.setAttribute('aria-hidden', 'true');
      }
      function clampIndex(i){ if (i < 0) return fotos.length-1; if (i >= fotos.length) return 0; return i; }
      function updateViewer(){
        const src = fotos[currentIndex];
        viewImg.src = src;
        viewCaption.textContent = `Foto ${currentIndex + 1} de ${fotos.length}`;
      }
      function next(){ currentIndex = clampIndex(currentIndex + 1); updateViewer(); }
      function prev(){ currentIndex = clampIndex(currentIndex - 1); updateViewer(); }

      // Click en el preview del index => abre overlay
      root.addEventListener('click', (e) => {
        const btn = e.target.closest('.gal-item');
        if (!btn) return;
        const idx = parseInt(btn.dataset.idx || '0', 10) || 0;
        openOverlay(idx);
      });

      // Utilidad global para abrir la galería desde cualquier botón
      window.openGallery = (idx=0) => openOverlay(idx);

      DBG('Inicializada correctamente.');
    } catch (err) {
      OOPS('Falló la inicialización de la galería:', err);
    }
  });
})();
