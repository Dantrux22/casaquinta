// ================================
// CALCULADORA DE PRECIOS (pro)
// - Mínimo dinámico: 20 personas
// - Máximo: 100 personas
// - Formato ARS con Intl.NumberFormat
// ================================
(function () {
  const radios = document.querySelectorAll('input[name="horario-dia"]');
  const inputP = document.getElementById('cantidad-personas-dia');
  const outTotal = document.getElementById('TOTAL');
  const msgMin = document.getElementById('mensaje-personas-dia');
  const msgMax = document.getElementById('mensaje-personas-dia2');

  const MIN_PERSONAS = 20;
  const MAX_PERSONAS = 100;
  const fmtARS = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  });

  function getPrecioUnitario() {
    const sel = document.querySelector('input[name="horario-dia"]:checked');
    return sel ? Number(sel.value) : 0;
  }

  function calcularTotal() {
    // Sanitizar: solo números
    if (inputP && inputP.value) {
      inputP.value = inputP.value.replace(/\D+/g, '');
    }

    const personas = Number.parseInt(inputP?.value || '', 10);
    const precioUnitario = getPrecioUnitario();

    // Reset mensajes
    msgMin.style.display = 'none';
    msgMax.style.display = 'none';

    // Sin horario o sin personas válidas
    if (!precioUnitario || !Number.isFinite(personas) || personas <= 0) {
      outTotal.value = '';
      return;
    }

    // Capacidad máxima
    if (personas > MAX_PERSONAS) {
      outTotal.value = '';
      msgMax.style.display = 'block';
      return;
    }

    // Mínimo dinámico
    const minimo = MIN_PERSONAS * precioUnitario;
    let total;
    if (personas <= MIN_PERSONAS) {
      total = minimo;
      msgMin.style.display = 'block';
    } else {
      total = personas * precioUnitario;
    }

    outTotal.value = fmtARS.format(total);
  }

  // Listeners
  radios.forEach(r => r.addEventListener('change', calcularTotal));
  if (inputP) inputP.addEventListener('input', calcularTotal);

  // Cálculo inicial
  calcularTotal();

  // Exponer por si se llama desde HTML
  window.calcularTotal = calcularTotal;
})();
