// archivo: calendario.js

document.addEventListener('DOMContentLoaded', () => {
  // Nombres de meses y días
  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const weekdayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  // Límite hasta noviembre 2025
  const maxYear = 2025, maxMonth = 10;
  // Disponibilidad manual (YYYY-MM-DD)
  const availability = {
   '2025-06-14': { day: 'reserved', night: '' }
  };

  // Estado inicial
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  // Referencias DOM
  const calendarEl = document.getElementById('calendar');
  const monthTitleEl = document.getElementById('month-title');
  const dayChk = document.getElementById('day-shift');
  const nightChk = document.getElementById('night-shift');

  // Función para renderizar el calendario
  function renderCalendar() {
    monthTitleEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    calendarEl.innerHTML = '';

    // Cabecera de días de la semana
    weekdayNames.forEach(name => {
      const hd = document.createElement('div');
      hd.className = 'day-header';
      hd.textContent = name;
      calendarEl.appendChild(hd);
    });

    // Celdas vacías hasta el primer día
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'day empty';
      calendarEl.appendChild(empty);
    }

    // Días del mes
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.classList.add('day');
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      // Determina estado según turno activo
      const reservedDay = availability[dateKey]?.day === 'reserved';
      const reservedNight = availability[dateKey]?.night === 'reserved';
      let state = 'available';
      if (dayChk.checked && !nightChk.checked) state = reservedDay ? 'reserved' : 'available';
      else if (!dayChk.checked && nightChk.checked) state = reservedNight ? 'reserved' : 'available';
      else if (dayChk.checked && nightChk.checked) state = (reservedDay || reservedNight) ? 'reserved' : 'available';
      cell.classList.add(state);
      cell.textContent = d;
      calendarEl.appendChild(cell);
    }
  }

  // Navegación de meses
  window.changeMonth = delta => {
    currentMonth += delta;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    else if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentYear > maxYear || (currentYear === maxYear && currentMonth > maxMonth)) {
      currentYear = maxYear;
      currentMonth = maxMonth;
    }
    renderCalendar();
  };

  // Asegura exclusividad de turno y re-renderiza
  dayChk.addEventListener('change', () => {
    if (dayChk.checked) nightChk.checked = false;
    renderCalendar();
  });
  nightChk.addEventListener('change', () => {
    if (nightChk.checked) dayChk.checked = false;
    renderCalendar();
  });

  // Render inicial
  renderCalendar();
});
