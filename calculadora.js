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


const months = [
    {
      name: "Noviembre 2024",
      shifts: {
        day: [
          { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "reserved" },
          { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
          { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "reserved" },
          { day: "10", status: "reserved" }, { day: "11", status: "available" }, { day: "12", status: "available" },
          { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
          { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
          { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
          { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "available" },
          { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
          { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "available" }
        ],
        night: [
          { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
          { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
          { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "reserved" },
          { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
          { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
          { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
          { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
          { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "available" },
          { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
          { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "available" }
        ]
      }
    },
    {
      name: "Diciembre 2024",
      shifts: {
        day: [
          { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
          { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
          { day: "7", status: "reserved" }, { day: "8", status: "available" }, { day: "9", status: "available" },
          { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
          { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
          { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
          { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
          { day: "22", status: "reserved" }, { day: "23", status: "available" }, { day: "24", status: "available" },
          { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
          { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "available" },
          { day: "31", status: "available" }
        ],
        night: [
          { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
          { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
          { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "available" },
          { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
          { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
          { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
          { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
          { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "available" },
          { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
          { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "available" },
          { day: "31", status: "available" }
        ]
      }
    },
    {
      name: "Enero 2025",
      shifts: {
        day: [
          { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
          { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
          { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "available" },
          { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
          { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
          { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
          { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
          { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "available" },
          { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
          { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "available" },
          { day: "31", status: "available" }
        ],
        night: [
          { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
          { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
          { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "available" },
          { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
          { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
          { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
          { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
          { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "available" },
          { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
          { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "available" },
          { day: "31", status: "available" }
        ]
      }
    },
    {
         name: "Febrero 2024",
        shifts: {
          day: [
            { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
            { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
            { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "available" },
            { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
            { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
            { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
            { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
            { day: "22", status: "available" }, { day: "23", status: "reserved" }, { day: "24", status: "reserved" },
            { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
            { day: "28", status: "available" }
          ],
          night: [
            { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
            { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
            { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "available" },
            { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
            { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
            { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
            { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
            { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "available" },
            { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
            { day: "28", status: "available" } 
        ]
        }
      },
      {
        name: "Marzo 2025",
        shifts: {
          day: [
            { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "reserved" },
            { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
            { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "reserved" },
            { day: "10", status: "reserved" }, { day: "11", status: "available" }, { day: "12", status: "available" },
            { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
            { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
            { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
            { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "available" },
            { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
            { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "available" }
          ],
          night: [
            { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
            { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
            { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "available" },
            { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
            { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
            { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
            { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
            { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "available" },
            { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
            { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "available" }
          ]
        }
      }
  ];

  
  let currentMonthIndex = 0;
let currentShift = 'day';

function renderCalendar() {
  const calendarEl = document.getElementById("calendar");
  const monthTitle = document.getElementById("month-title");
  const currentMonth = months[currentMonthIndex];
  monthTitle.textContent = currentMonth.name;
  
  calendarEl.innerHTML = `
    <div class="day-header">Dom</div>
    <div class="day-header">Lun</div>
    <div class="day-header">Mar</div>
    <div class="day-header">Mié</div>
    <div class="day-header">Jue</div>
    <div class="day-header">Vie</div>
    <div class="day-header">Sáb</div>
  `;
  
  const monthName = currentMonth.name.split(' ')[0];
  const monthNumber = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].indexOf(monthName) + 1;
  const year = currentMonth.name.split(' ')[1];
  const firstDayOffset = new Date(year, monthNumber - 1, 1).getDay();
  
  for (let i = 0; i < firstDayOffset; i++) {
    calendarEl.innerHTML += `<div class="day"></div>`;
  }
  
  currentMonth.shifts[currentShift].forEach(day => {
    calendarEl.innerHTML += `
      <div class="day ${day.status} ${currentShift}">
        ${day.day}
      </div>
    `;
  });
}

function changeMonth(direction) {
  currentMonthIndex = (currentMonthIndex + direction + months.length) % months.length;
  renderCalendar();
}

function changeShift(shift) {
  currentShift = shift;
  renderCalendar();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
});
function changeShift(shift) {
    currentShift = shift;
    renderCalendar();
    
    // Actualiza el checkbox seleccionado
    const dayShiftCheckbox = document.getElementById('day-shift');
    const nightShiftCheckbox = document.getElementById('night-shift');
    
    if (shift === 'day') {
      dayShiftCheckbox.checked = true;
      nightShiftCheckbox.checked = false;
    } else {
      dayShiftCheckbox.checked = false;
      nightShiftCheckbox.checked = true;
    }
  }
  