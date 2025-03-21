
// CALENDARIO
const months = [
  {
    name: "Marzo 2025",
    shifts: {
      day: [
        { day: "1", status: "reserved" },
        { day: "2", status: "reserved" },
        { day: "3", status: "reserved" },
        { day: "4", status: "reserved" },
        { day: "5", status: "reserved" },
        { day: "6", status: "reserved" },
        { day: "7", status: "reserved" },
        { day: "8", status: "reserved" },
        { day: "9", status: "reserved" },
        { day: "10", status: "reserved" },
        { day: "11", status: "reserved" },
        { day: "12", status: "reserved" },
        { day: "13", status: "reserved" },
        { day: "14", status: "reserved" },
        { day: "15", status: "reserved" },
        { day: "16", status: "reserved" },
        { day: "17", status: "reserved" },
        { day: "18", status: "reserved" },
        { day: "19", status: "reserved" },
        { day: "20", status: "reserved" },
        { day: "21", status: "reserved" },
        { day: "22", status: "available" },
        { day: "23", status: "reserved" },
        { day: "24", status: "reserved" },
        { day: "25", status: "reserved" },
        { day: "26", status: "reserved" },
        { day: "27", status: "reserved" },
        { day: "28", status: "reserved" },
        { day: "29", status: "available" },
        { day: "30", status: "reserved" },
      ],
      night: [
        { day: "1", status: "available" },
        { day: "2", status: "reserved" },
        { day: "3", status: "reserved" },
        { day: "4", status: "available" },
        { day: "5", status: "available" },
        { day: "6", status: "available" },
        { day: "7", status: "available" },
        { day: "8", status: "available" },
        { day: "9", status: "available" },
        { day: "10", status: "available" },
        { day: "11", status: "available" },
        { day: "12", status: "available" },
        { day: "13", status: "available" },
        { day: "14", status: "available" },
        { day: "15", status: "available" },
        { day: "16", status: "available" },
        { day: "17", status: "available" },
        { day: "18", status: "available" },
        { day: "19", status: "available" },
        { day: "20", status: "available" },
        { day: "21", status: "available" },
        { day: "22", status: "available" },
        { day: "23", status: "available" },
        { day: "24", status: "available" },
        { day: "25", status: "available" },
        { day: "26", status: "available" },
        { day: "27", status: "available" },
        { day: "28", status: "available" },
        { day: "29", status: "reserved" },
        { day: "30", status: "available" },
      ],
    },
  },
];

let currentMonthIndex = 0;
let currentShift = "day";

function renderCalendar() {
  const calendarEl = document.getElementById("calendar");
  const monthTitle = document.getElementById("month-title");
  const currentMonth = months[currentMonthIndex];
  monthTitle.textContent = currentMonth.name;

  const monthName = currentMonth.name.split(" ")[0];
  const monthNumber = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ].indexOf(monthName) + 1;
  const year = parseInt(currentMonth.name.split(" ")[1]);
  
  
      const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const firstDayOffset = new Date(year, monthNumber - 1, 1).getDay();
      const firstDayOfWeek = daysOfWeek[firstDayOffset];
    
      calendarEl.innerHTML = `
        <div class="day-header">Dom</div>
        <div class="day-header">Lun</div>
        <div class="day-header">Mar</div>
        <div class="day-header">Mié</div>
        <div class="day-header">Jue</div>
        <div class="day-header">Vie</div>
        <div class="day-header">Sáb</div>
      `;
    
      for (let i = 0; i < firstDayOffset; i++) {
        calendarEl.innerHTML += `<div class="day"></div>`;
      }
    
      const daysInMonth = new Date(year, monthNumber, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const day = currentMonth.shifts[currentShift].find((d) => d.day === i.toString());
        const status = day ? day.status : "available";
        calendarEl.innerHTML += `
          <div class="day ${status} ${currentShift}">
            ${i}
          </div>
        `;
      }
    }
    
    function changeMonth(direction) {
      currentMonthIndex = (currentMonthIndex + direction + months.length) % months.length;
      renderCalendar();
    }
    
    function changeShift(shift) {
      currentShift = shift;
      renderCalendar();
      // Actualiza el checkbox seleccionado
      const dayShiftCheckbox = document.getElementById("day-shift");
      const nightShiftCheckbox = document.getElementById("night-shift");
      if (shift === "day") {
        dayShiftCheckbox.checked = true;
        nightShiftCheckbox.checked = false;
      } else {
        dayShiftCheckbox.checked = false;
        nightShiftCheckbox.checked = true;
      }
    }
    
    document.addEventListener("DOMContentLoaded", () => {
      renderCalendar();
    });
