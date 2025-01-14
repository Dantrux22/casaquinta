// Función para calcular el total
function calcularTotal() {
  var cantidadPersonas = document.getElementById('cantidad-personas-dia').value;
  var precioPorPersona = document.querySelector('input[name="horario-dia"]:checked').value;

  if (cantidadPersonas <= 20) {
    document.getElementById('TOTAL').value = '$130.000';
  } else {
    var total = cantidadPersonas * precioPorPersona;
    document.getElementById('TOTAL').value = '$' + total.toLocaleString();
  }

  // Mostrar o ocultar mensaje de error según la cantidad de personas
  if (cantidadPersonas < 20) {
    document.getElementById('mensaje-personas-dia').style.display = 'block';
  } else {
    document.getElementById('mensaje-personas-dia').style.display = 'none';
  }

  // Mostrar o ocultar mensaje de error según la cantidad de personas
  if (cantidadPersonas > 100) {
    document.getElementById('mensaje-personas-dia2').style.display = 'block';
  } else {
    document.getElementById('mensaje-personas-dia2').style.display = 'none';
  }
}

// Agregar evento de cambio a los campos de cantidad de personas y horario
document.getElementById('cantidad-personas-dia').addEventListener('input', calcularTotal);
document.querySelectorAll('input[name="horario-dia"]').forEach(radio => radio.addEventListener('change', calcularTotal));