// scrips/availability-gsheet.js
// Lee reservas EN VIVO desde Google Sheets (GViz JSONP, sin CORS)
// Columnas esperadas (fila 1): Fecha | dia | noche

(function () {
  // === CONFIG: tu hoja ===
  const SHEET_ID   = '16tXHyV_JYjifJEyedDLUwJ1ElpfDLyf6WulxbFEssO4';
  const GID        = '';          // si preferís, pegá acá el gid exacto de "EN VIVO" (p. ej. '0')
  const SHEET_NAME = 'EN VIVO';   // o usa el nombre de la pestaña
  const RANGE      = '';          // opcional: 'A:C'

  function buildUrl() {
    const base = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1`;
    const byGid   = GID ? `&gid=${encodeURIComponent(GID)}` : '';
    const bySheet = (!GID && SHEET_NAME) ? `&sheet=${encodeURIComponent(SHEET_NAME)}` : '';
    const range   = RANGE ? `&range=${encodeURIComponent(RANGE)}` : '';
    const bust    = `&t=${Date.now()}`; // anti-cache
    return base + byGid + bySheet + range + bust;
  }

  // Hook JSONP GViz
  window.google = window.google || {};
  google.visualization = google.visualization || {};
  google.visualization.Query = google.visualization.Query || {};

  google.visualization.Query.setResponse = function (resp) {
    try {
      const table = resp && resp.table;
      if (!table) throw new Error('Respuesta GViz inválida');

      // Tomamos labels si existen; si no, caemos a índices 0/1/2 (A/B/C)
      const cols = (table.cols || []).map(c => (c && c.label || '').toLowerCase().trim());
      let idxFecha = cols.indexOf('fecha');
      let idxDia   = cols.indexOf('dia');
      let idxNoche = cols.indexOf('noche');
      if (idxFecha < 0) { idxFecha = 0; }   // A
      if (idxDia   < 0) { idxDia   = 1; }   // B
      if (idxNoche < 0) { idxNoche = 2; }   // C

      // Helpers
      const isTrue = (v) => {
        if (v == null) return false;
        const s = String(v).trim().toLowerCase();
        return s !== '' && !['0','no','false','-','n','f'].includes(s);
      };

      // Parser de fecha robusto (fecha real, YYYY-MM-DD, dd/mm/aaaa o d/m/aaaa)
      const toYmd = (v) => {
        if (v instanceof Date && !isNaN(v)) {
          const y=v.getFullYear(), m=String(v.getMonth()+1).padStart(2,'0'), d=String(v.getDate()).padStart(2,'0');
          return `${y}-${m}-${d}`;
        }
        const s = String(v || '').trim();
        if (!s) return null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s; // ISO
        const m1 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (m1) {
          const dd = m1[1].padStart(2,'0'), mm = m1[2].padStart(2,'0'), yy = m1[3];
          return `${yy}-${mm}-${dd}`;
        }
        const sUS = s.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, '$2/$1/$3');
        const d2 = new Date(sUS);
        if (!isNaN(d2)) {
          const y=d2.getFullYear(), m=String(d2.getMonth()+1).padStart(2,'0'), d=String(d2.getDate()).padStart(2,'0');
          return `${y}-${m}-${d}`;
        }
        return null;
      };

      // Armar mapa YYYY-MM-DD -> {day/night}
      const out = {};
      for (const r of (table.rows || [])) {
        const c = r.c || [];
        const key = toYmd(c[idxFecha]?.v);
        if (!key) continue;
        const vDia   = c[idxDia]?.v;
        const vNoche = c[idxNoche]?.v;
        out[key] = {
          day:   isTrue(vDia)   ? 'reserved' : '',
          night: isTrue(vNoche) ? 'reserved' : ''
        };
      }

      // Publicar dataset global
      window.AV_DATA = out;

      // Avisar a la app + re-render del mes actual
      document.dispatchEvent(new CustomEvent('avdata:loaded', { detail: { count: Object.keys(out).length }}));
      if (typeof window.changeMonth === 'function') window.changeMonth(0);

      console.info('[availability] cargado', Object.keys(out).length, 'fechas desde Sheets');
    } catch (e) {
      console.error('[availability] error:', e);
    }
  };

  // Inyectar <script> JSONP
  const s = document.createElement('script');
  s.src = buildUrl();
  s.async = true;
  document.head.appendChild(s);
})();
