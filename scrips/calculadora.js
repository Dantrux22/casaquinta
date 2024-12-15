function calcularTotal() {
  var totalInput = document.getElementById("TOTAL");
  var cantidadPersonasDia = parseInt(document.getElementById("cantidad-personas-dia").value) || 0;
  var selectedHorario = document.querySelector('input[name="horario-dia"]:checked');
  var precio = parseInt(selectedHorario.value);

  var total = cantidadPersonasDia * precio;
  totalInput.value = total > 0 ? total.toLocaleString('es-AR', {style: 'currency', currency: 'ARS'}) : "";
  document.getElementById("mensaje-personas-dia").style.display = (cantidadPersonasDia < 20 || cantidadPersonasDia > 80) ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("cantidad-personas-dia").addEventListener("input", function() {
    calcularTotal();
  });
  document.getElementById("horario-dia-1").addEventListener("change", calcularTotal);
  document.getElementById("horario-dia-2").addEventListener("change", calcularTotal);
});

