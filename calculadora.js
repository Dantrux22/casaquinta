function mostrarCampos() {
    var tipoAlquiler = document.getElementById("tipo-alquiler").value;
    var horarioDia = document.getElementById("horario-dia");

    if (tipoAlquiler === "dia") {
        horarioDia.style.display = "block";
    } else {
        horarioDia.style.display = "none";
    }
    calcularTotal();
}

function calcularTotal() {
    var totalInput = document.getElementById("TOTAL");
    var cantidadPersonas = parseInt(document.getElementById("cantidad-personas-dia").value) || 0;
    var selectedHorario = document.querySelector('input[name="horario-dia"]:checked');
    var total = 0;

    // Si hay un horario seleccionado, calcular el precio
    if (selectedHorario) {
        var precioPorPersona = parseInt(selectedHorario.value);
        total = cantidadPersonas * precioPorPersona;
    }

    // Mostrar el total calculado
    totalInput.value = total > 0 ? total.toLocaleString('es-AR', {style: 'currency', currency: 'ARS'}) : "";

    // Mostrar mensaje de advertencia si la cantidad no está entre 20 y 80 personas
    document.getElementById("mensaje-personas-dia").style.display = (cantidadPersonas < 20 || cantidadPersonas > 80) ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", function() {
    mostrarCampos();
});

// Actualizar el total automáticamente al ingresar la cantidad de personas
document.getElementById("cantidad-personas-dia").addEventListener("input", calcularTotal)