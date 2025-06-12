// archivo: calendario.js

document.addEventListener('DOMContentLoaded', () => {
  // Configuración
  const monthNames = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];
  const weekdayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const maxYear = 2025;
  const maxMonth = 10; // 0 = enero ... 10 = noviembre

  // Disponibilidad manual (YYYY-MM-DD)
  const availability = {
    // Ejemplo: '2025-06-15': { day: 'reserved', night: 'reserved' }
  };

  // Estado actual
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  // Referencias al DOM
  const calendarEl = document.getElementById('calendar');
  const monthTitleEl = document.getElementById('month-title');
  const dayChk = document.getElementById('day-shift');
  const nightChk = document.getElementById('night-shift');

  // Render del calendario
  function renderCalendar() {
    // Título mes-año
    monthTitleEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    // Limpia contenedor
    calendarEl.innerHTML = '';

    // 1) Encabezado días de semana
    weekdayNames.forEach(name => {
      const hd = document.createElement('div');
      hd.classList.add('day-header');
      hd.textContent = name;
      calendarEl.appendChild(hd);
    });

    // 2) Celdas vacías antes del primer día
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.classList.add('day', 'empty');
      calendarEl.appendChild(emptyCell);
    }

    // 3) Días del mes
    const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let d = 1; d <= daysCount; d++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      // Determina estado según turno
      const resDay = availability[dateKey]?.day === 'reserved';
      const resNight = availability[dateKey]?.night === 'reserved';
      let statusClass = 'available';
      if (dayChk.checked && !nightChk.checked) statusClass = resDay ? 'reserved' : 'available';
      else if (!dayChk.checked && nightChk.checked) statusClass = resNight ? 'reserved' : 'available';
      else if (dayChk.checked && nightChk.checked) statusClass = (resDay || resNight) ? 'reserved' : 'available';

      const cell = document.createElement('div');
      cell.classList.add('day', statusClass);
      cell.textContent = d;
      calendarEl.appendChild(cell);
    }
  }

  // Navegar meses
  window.changeMonth = delta => {
    currentMonth += delta;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentYear > maxYear || (currentYear === maxYear && currentMonth > maxMonth)) {
      currentYear = maxYear;
      currentMonth = maxMonth;
    }
    renderCalendar();
  };

  // Cambiar turno visible
  window.changeShift = shift => renderCalendar();

  // Listeners de checkboxes
  dayChk.addEventListener('change', renderCalendar);
  nightChk.addEventListener('change', renderCalendar);

  // Render inicial
  renderCalendar();
});
