// scrips/availability-csv.js
// Carga reservas "en vivo" desde un CSV publicado (Google Sheets → Publicar → CSV).
// Columnas (fila 1): fecha, dia, noche
// - fecha: YYYY-MM-DD o dd/mm/aaaa
// - dia / noche: cualquier marca => reservado (vacío => disponible)

(function () {
  // Tu CSV publicado:
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEvoBT-brpQch5zfkHN_93XYqMsQeF37w6474MA-uNKoadg7SPuh5bLANCWql_KYpH3A1KDsrG2u5S/pub?gid=2069016844&single=true&output=csv';

  // Fallback para evitar bloqueos CORS (solo GET público, sin datos sensibles)
  const FALLBACKS = [
    (u) => u, // directo
    (u) => `https://r.jina.ai/http://` + u.replace(/^https?:\/\//, ''), // proxy lectura
  ];

  // ==== Utils ====
  function toYmd(v) {
    if (v instanceof Date && !isNaN(v)) {
      const y=v.getFullYear(), m=String(v.getMonth()+1).padStart(2,'0'), d=String(v.getDate()).padStart(2,'0');
      return `${y}-${m}-${d}`;
    }
    const s = String(v || '').trim();
    if (!s) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s; // ISO
    const m1 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/); // dd/mm/aaaa
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
  }

  function isTrue(v) {
    if (v == null) return false;
    const s = String(v).trim().toLowerCase();
    return s !== '' && !['0','no','false','-','n','f'].includes(s);
  }

  // Parseo CSV simple con autodetección , / ;
  function parseCsv(text) {
    if (!text) return { rows: [] };
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const firstLine = text.split('\n', 1)[0] || '';
    const sep = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';

    const lines = text.split('\n').filter(l => l.trim() !== '');
    const rows = lines.map(line => {
      // Split básico (Excel suele no necesitar comillas complejas para este caso)
      return line.split(sep).map(c => c.replace(/^"(.*)"$/,'$1').trim());
    });

    return { rows };
  }

  function buildMap(rows) {
    if (!rows || !rows.length) return {};
    const header = rows[0].map(h => (h || '').toLowerCase().trim());
    let idxFecha = header.indexOf('fecha');
    let idxDia   = header.indexOf('dia');
    let idxNoche = header.indexOf('noche');
    if (idxFecha < 0) idxFecha = 0;
    if (idxDia   < 0) idxDia   = 1;
    if (idxNoche < 0) idxNoche = 2;

    const out = {};
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const key = toYmd(r[idxFecha]);
      if (!key) continue;
      const vDia   = r[idxDia];
      const vNoche = r[idxNoche];

      const prev = out[key] || { day: '', night: '' };
      out[key] = {
        day:   (prev.day   === 'reserved') || isTrue(vDia)   ? 'reserved' : '',
        night: (prev.night === 'reserved') || isTrue(vNoche) ? 'reserved' : ''
      };
    }
    return out;
  }

  async function fetchWithFallback(url) {
    let lastErr = null;
    for (const make of FALLBACKS) {
      const u = make(url);
      try {
        const res = await fetch(`${u}&t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const txt = await res.text();
        return txt;
      } catch (e) {
        lastErr = e;
        // intenta el siguiente
      }
    }
    throw lastErr || new Error('No se pudo obtener el CSV');
  }

  async function loadCsv() {
    try {
      const csv = await fetchWithFallback(CSV_URL);
      const { rows } = parseCsv(csv);
      const map = buildMap(rows);

      // Exponer en el global
      window.AV_DATA = map;

      // Notificar y re-render
      document.dispatchEvent(new CustomEvent('avdata:loaded', {
        detail: { count: Object.keys(map).length }
      }));
      if (typeof window.changeMonth === 'function') window.changeMonth(0);

      console.info('[availability-csv] cargado', Object.keys(map).length, 'fechas desde CSV');
    } catch (err) {
      console.error('[availability-csv] error:', err);
    }
  }

  // Cargar al iniciar
  loadCsv();

  // (Opcional) refrescar cada 5 minutos por si actualizás la hoja
  // setInterval(loadCsv, 5 * 60 * 1000);
})();
