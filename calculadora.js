const precioPorHora = 500; 
const adicionalPorPersona = 5000;

function mostrarCampos() {
  var tipoAlquiler = document.getElementById("tipo-alquiler").value;
  var horarioDia = document.getElementById("horario-dia");
  var horarioPersonalizado = document.getElementById("horario-personalizado");
  
  if (tipoAlquiler === "dia") {
    horarioDia.style.display = "block";
    horarioPersonalizado.style.display = "none";
  } else {
    horarioDia.style.display = "none";
    horarioPersonalizado.style.display = "block";
  }
  
  calcularTotal();
}

function calcularTotal() {
  var totalInput = document.getElementById("TOTAL");
  var cantidadPersonasDia = parseInt(document.getElementById("cantidad-personas-dia").value) || 0;
  var selectedHorario = document.querySelector('input[name="horario-dia"]:checked');
  var total = 0;
  
  if (selectedHorario) {
    var precioPorPersona = parseInt(selectedHorario.value);
    total = cantidadPersonasDia * precioPorPersona;
  }
  
  var cantidadPersonasPersonalizado = parseInt(document.getElementById("cantidad-personas-personalizado").value) || 0;
  var horaEntrada = document.getElementById("hora-inicio").value;
  var horaSalida = document.getElementById("hora-fin").value;
  
  if (horaEntrada && horaSalida) {
    const [horasEntrada, minutosEntrada] = horaEntrada.split(":").map(Number);
    const [horasSalida, minutosSalida] = horaSalida.split(":").map(Number);
    
    const totalHoras = calcularHoras(horasEntrada, minutosEntrada, horasSalida, minutosSalida);
    
    if (totalHoras > 24) {
      alert("No se pueden superar las 24 horas.");
      return;
    }
    
    total = totalHoras * precioPorHora * cantidadPersonasPersonalizado + adicionalPorPersona * cantidadPersonasPersonalizado;
  }
  
  totalInput.value = total > 0 ? total.toLocaleString('es-AR', {style: 'currency', currency: 'ARS'}) : "";
  
  document.getElementById("mensaje-personas-dia").style.display = (cantidadPersonasDia < 20 || cantidadPersonasDia > 80) ? "block" : "none";
}

function calcularHoras(horasEntrada, minutosEntrada, horasSalida, minutosSalida) {
  if (horasEntrada === horasSalida && minutosEntrada === minutosSalida) {
    return 24; 
  }
  
  const totalMinutosEntrada = horasEntrada * 60 + minutosEntrada;
  const totalMinutosSalida = horasSalida * 60 + minutosSalida;
  
  let diferenciaMinutos = totalMinutosSalida - totalMinutosEntrada;
  
  if (diferenciaMinutos < 0) { 
    diferenciaMinutos += 24 * 60;
  } else if (totalMinutosEntrada > totalMinutosSalida) { 
    diferenciaMinutos = totalMinutosEntrada - totalMinutosSalida;
  }
  
  return Math.abs(diferenciaMinutos / 60);
}
document.addEventListener("DOMContentLoaded", function() {
  mostrarCampos();
});

document.getElementById("tipo-alquiler").addEventListener("change", mostrarCampos);
document.getElementById("cantidad-personas-dia").addEventListener("input", calcularTotal);
document.getElementById("hora-inicio").addEventListener("input", calcularTotal);
document.getElementById("hora-fin").addEventListener("input", calcularTotal);
document.getElementById("cantidad-personas-personalizado").addEventListener("input", calcularTotal);
document.getElementById("horario-dia-1").addEventListener("change", calcularTotal);
document.getElementById("horario-dia-2").addEventListener("change", calcularTotal);

function actualizarTotal() {
  calcularTotal();
}

setInterval(actualizarTotal, 1000);





// CALENDARIO
const months = [
    {
      name: "Noviembre 2024",
      shifts: {
        day: [
          { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "reserved" },
          { day: "4", status: "available" }, { day: "5", status: "reserved" }, { day: "6", status: "available" },
          { day: "7", status: "reserved" }, { day: "8", status: "available" }, { day: "9", status: "reserved" },
          { day: "10", status: "reserved" }, { day: "11", status: "available" }, { day: "12", status: "reserved" },
          { day: "13", status: "available" }, { day: "14", status: "reserved" }, { day: "15", status: "reserved" },
          { day: "16", status: "reserved" }, { day: "17", status: "reserved" }, { day: "18", status: "reserved" },
          { day: "19", status: "reserved" }, { day: "20", status: "available" }, { day: "21", status: "reserved" },
          { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "reserved" },
          { day: "25", status: "available" }, { day: "26", status: "reserved" }, { day: "27", status: "available" },
          { day: "28", status: "reserved" }, { day: "29", status: "available" }, { day: "30", status: "available" }
        ],
        night: [
          { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
          { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
          { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "reserved" },
          { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
          { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "reserved" },
          { day: "16", status: "reserved" }, { day: "17", status: "reserved" }, { day: "18", status: "reserved" },
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
          { day: "7", status: "reserved" }, { day: "8", status: "reserved" }, { day: "9", status: "available" },
          { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
          { day: "13", status: "available" }, { day: "14", status: "reserved" }, { day: "15", status: "reserved" },
          { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
          { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "available" },
          { day: "22", status: "reserved" }, { day: "23", status: "reserved" }, { day: "24", status: "reserved" },
          { day: "25", status: "reserved" }, { day: "26", status: "available" }, { day: "27", status: "available" },
          { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "reserved" },
          { day: "31", status: "reserved" }
        ],
        night: [
          { day: "1", status: "available" }, { day: "2", status: "available" }, { day: "3", status: "available" },
          { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
          { day: "7", status: "available" }, { day: "8", status: "reserved" }, { day: "9", status: "available" },
          { day: "10", status: "available" }, { day: "11", status: "available" }, { day: "12", status: "available" },
          { day: "13", status: "reserved" }, { day: "14", status: "reserved" }, { day: "15", status: "reserved" },
          { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
          { day: "19", status: "available" }, { day: "20", status: "available" }, { day: "21", status: "reserved" },
          { day: "22", status: "available" }, { day: "23", status: "available" }, { day: "24", status: "reserved" },
          { day: "25", status: "available" }, { day: "26", status: "available" }, { day: "27", status: "available" },
          { day: "28", status: "available" }, { day: "29", status: "available" }, { day: "30", status: "available" },
          { day: "31", status: "reserved" }
        ]
      }
    },
    {
      name: "Enero 2025",
      shifts: {
        day: [
          { day: "1", status: "reserved" }, { day: "2", status: "available" }, { day: "3", status: "available" },
          { day: "4", status: "available" }, { day: "5", status: "available" }, { day: "6", status: "available" },
          { day: "7", status: "available" }, { day: "8", status: "available" }, { day: "9", status: "available" },
          { day: "10", status: "available" }, { day: "11", status: "reserved" }, { day: "12", status: "available" },
          { day: "13", status: "available" }, { day: "14", status: "available" }, { day: "15", status: "available" },
          { day: "16", status: "available" }, { day: "17", status: "available" }, { day: "18", status: "available" },
          { day: "19", status: "reserved" }, { day: "20", status: "available" }, { day: "21", status: "available" },
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
         name: "Febrero 2025",
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
            { day: "22", status: "available" }, { day: "23", status: "reserved" }, { day: "24", status: "reserved" },
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
  