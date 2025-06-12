function calcularTotal() {
  const inputP = document.getElementById('cantidad-personas-dia');
  const personas = parseInt(inputP.value, 10);
  const seleccionado = document.querySelector('input[name="horario-dia"]:checked');
  const totalInput = document.getElementById('TOTAL');
  const msgMin = document.getElementById('mensaje-personas-dia');
  const msgMax = document.getElementById('mensaje-personas-dia2');

  // Si no hay horario seleccionado o no es un número válido
  if (!seleccionado || isNaN(personas) || personas <= 0) {
    totalInput.value = '';
    msgMin.style.display = 'none';
    msgMax.style.display = 'none';
    return;
  }

  const precioUnitario = Number(seleccionado.value);
  const minimo = precioUnitario * 20;

  // Capacidad máxima
  if (personas > 100) {
    totalInput.value = '';
    msgMax.style.display = 'block';
    msgMin.style.display = 'none';
    return;
  }
  msgMax.style.display = 'none';

  // Hasta 20 personas → mínimo dinámico
  let total;
  if (personas <= 20) {
    total = minimo;
    msgMin.style.display = 'block';
  } else {
    total = personas * precioUnitario;
    msgMin.style.display = 'none';
  }

  // Muestro el total formateado
  totalInput.value = '$' + total.toLocaleString('es-AR');
}

// Listeners para recalcular en vivo
document.getElementById('cantidad-personas-dia')
        .addEventListener('input', calcularTotal);
document.querySelectorAll('input[name="horario-dia"]')
        .forEach(radio => radio.addEventListener('change', calcularTotal));

// Cálculo inicial en caso de que ya haya valor y opción marcada
calcularTotal();
