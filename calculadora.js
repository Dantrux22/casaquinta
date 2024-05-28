function mostrarCampos() {
    var tipoAlquiler = document.getElementById("tipo-alquiler").value;
    var horarioDia = document.getElementById("horario-dia");
    var horarioHospedaje = document.getElementById("horario-hospedaje");

    if (tipoAlquiler === "dia") {
        horarioDia.style.display = "block";
        horarioHospedaje.style.display = "none";
    } else if (tipoAlquiler === "hospedaje") {
        horarioDia.style.display = "none";
        horarioHospedaje.style.display = "block";
    }

    calcularTotal();
}

function calcularTotal() {
    var tipoAlquiler = document.getElementById("tipo-alquiler").value;
    var totalInput = document.getElementById("TOTAL");
    var total = 0;
    var selectedHorario = null; // Variable to store the selected horario

    if (tipoAlquiler === "dia") {
        var cantidadPersonasDia = parseInt(document.getElementById("cantidad-personas-dia").value) || 0;
        var precioDia1 = 4600;
        var precioDia2 = 5000;

        var horarioDiaCheckboxes = document.getElementsByName("horario-dia"); // Get all checkboxes

        // Check for selected checkboxes and calculate total
        for (var i = 0; i < horarioDiaCheckboxes.length; i++) {
            if (horarioDiaCheckboxes[i].checked) {
                if (!selectedHorario) { // Only count the first selected checkbox
                    selectedHorario = horarioDiaCheckboxes[i].id;
                    if (selectedHorario === "horario-dia-1") {
                        total = cantidadPersonasDia * precioDia1;
                    } else if (selectedHorario === "horario-dia-2") {
                        total = cantidadPersonasDia * precioDia2;
                    }
                    // Deselect all other checkboxes
                    for (var j = 0; j < horarioDiaCheckboxes.length; j++) {
                        if (i !== j) {
                            horarioDiaCheckboxes[j].checked = false;
                        }
                    }
                }
            }
        }

        document.getElementById("mensaje-personas-dia").style.display = (cantidadPersonasDia < 20 || cantidadPersonasDia > 80) ? "block" : "none";
    } else if (tipoAlquiler === "hospedaje") {
        var cantidadPersonasHospedaje = parseInt(document.getElementById("cantidad-personas-hospedaje").value) || 0;
        var cantidadDias = parseInt(document.getElementById("cantidad-dias").value) || 0;
        var precioHospedaje = 16000;

        total = cantidadPersonasHospedaje * cantidadDias * precioHospedaje;

        document.getElementById("mensaje-dias").style.display = (cantidadDias < 2 || cantidadDias > 15) ? "block" : "none";
        document.getElementById("mensaje-personas-hospedaje").style.display = (cantidadPersonasHospedaje < 2 || cantidadPersonasHospedaje > 5) ? "block" : "none";
    }

    totalInput.value = total.toLocaleString('es-AR', {style: 'currency', currency: 'ARS'});
}

document.addEventListener("DOMContentLoaded", function() {
    mostrarCampos();
});

document.getElementById("cantidad-personas-dia").addEventListener("input", calcularTotal);
document.getElementById("horario-dia-1").addEventListener("change", calcularTotal);
document.getElementById("horario-dia-2").addEventListener("change", calcularTotal);
document.getElementById("cantidad-personas-hospedaje").addEventListener("input", calcularTotal);
document.getElementById("cantidad-dias").addEventListener("input", calcularTotal);

