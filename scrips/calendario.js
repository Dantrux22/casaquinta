// scrips/calendario.js
// Calendario de disponibilidad: usa window.AV_DATA ({ 'YYYY-MM-DD': {day/night} })

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const NAV_MONTHS_AHEAD = 24;
    const NAV_MONTHS_BACK  = 0;

    const monthNames   = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const weekdayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

    const getAvailability = () => (window.AV_DATA && Object.keys(window.AV_DATA).length ? window.AV_DATA : {});

    const today = new Date();
    const todayKey = (d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`)(new Date());

    function addMonths(base, n) {
      const d = new Date(base.getFullYear(), base.getMonth(), 1);
      d.setMonth(d.getMonth() + n);
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    const minBound = addMonths(today, -NAV_MONTHS_BACK);
    const maxBound = addMonths(today,  NAV_MONTHS_AHEAD);

    function clampYearMonth(y, m) {
      if (y < minBound.year || (y === minBound.year && m < minBound.month)) return {year: minBound.year, month: minBound.month};
      if (y > maxBound.year || (y === maxBound.year && m > maxBound.month)) return {year: maxBound.year, month: maxBound.month};
      return {year: y, month: m};
    }

    const isPast = (y, m, d) => {
      const cmp = new Date(y, m, d, 23, 59, 59, 999);
      const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
      return cmp < todayEnd;
    };

    const fmtDateLabel = (y, m, d) => `${d} de ${monthNames[m]} de ${y}`;

    let { year: currentYear, month: currentMonth } = clampYearMonth(today.getFullYear(), today.getMonth());
    let selectedDate = null;

    const calendarEl   = document.getElementById('calendar');
    const monthTitleEl = document.getElementById('month-title');
    const dayChk       = document.getElementById('day-shift');
    const nightChk     = document.getElementById('night-shift');
    const waAnchor     = document.querySelector('.whatsapp-button');

    function ensureOneShift() {
      if (!dayChk.checked && !nightChk.checked) dayChk.checked = true;
    }
    ensureOneShift();

    const getShift = () => {
      if (dayChk.checked && !nightChk.checked)   return 'día (10:00 a 19:00)';
      if (!dayChk.checked && nightChk.checked)   return 'noche (21:00 a 06:00)';
      return 'cualquier turno';
    };

    function updateWhatsAppLink(y, m, d) {
      if (!waAnchor) return;
      const fechaTxt = fmtDateLabel(y, m, d);
      const turnoTxt = getShift();
      const msg = `Hola! Quiero reservar el ${fechaTxt} en el turno ${turnoTxt}. ¿Está disponible?`;
      waAnchor.setAttribute('href', `https://wa.me/5491122554301?text=${encodeURIComponent(msg)}`);
      waAnchor.setAttribute('aria-label', `Chatear por WhatsApp sobre ${fechaTxt}, ${turnoTxt}`);
    }

    function cellStateFor(dateKey) {
      const item = getAvailability()[dateKey];
      const reservedDay   = item?.day   === 'reserved';
      const reservedNight = item?.night === 'reserved';
      if (dayChk.checked && !nightChk.checked) return reservedDay ? 'reserved' : 'available';
      if (!dayChk.checked && nightChk.checked) return reservedNight ? 'reserved' : 'available';
      return (reservedDay || reservedNight) ? 'reserved' : 'available';
    }

    function renderCalendar() {
      monthTitleEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
      calendarEl.innerHTML = '';

      // Cabecera
      weekdayNames.forEach(name => {
        const hd = document.createElement('div');
        hd.className = 'day-header';
        hd.textContent = name;
        calendarEl.appendChild(hd);
      });

      // Vacíos hasta primer día
      const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Dom
      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'day empty';
        empty.setAttribute('aria-hidden', 'true');
        calendarEl.appendChild(empty);
      }

      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'day';
        btn.textContent = String(d);
        btn.setAttribute('aria-label', fmtDateLabel(currentYear, currentMonth, d));
        btn.setAttribute('aria-pressed', 'false');

        const past  = isPast(currentYear, currentMonth, d);
        const state = past ? 'reserved' : cellStateFor(dateKey);
        btn.classList.add(state);
        if (state === 'reserved') btn.disabled = true;

        if (selectedDate === dateKey) {
          btn.classList.add('selected');
          btn.setAttribute('aria-pressed', 'true');
        }

        btn.addEventListener('click', () => {
          if (btn.disabled) return;
          const prev = calendarEl.querySelector('.day.selected');
          if (prev) { prev.classList.remove('selected'); prev.setAttribute('aria-pressed', 'false'); }
          btn.classList.add('selected');
          btn.setAttribute('aria-pressed', 'true');
          selectedDate = dateKey;
          updateWhatsAppLink(currentYear, currentMonth, d);
        });

        calendarEl.appendChild(btn);
      }
    }

    window.changeMonth = delta => {
      let y = currentYear;
      let m = currentMonth + delta;
      while (m < 0)  { m += 12; y--; }
      while (m > 11) { m -= 12; y++; }
      ({year: y, month: m} = clampYearMonth(y, m));
      currentYear = y;
      currentMonth = m;
      renderCalendar();
    };

    dayChk.addEventListener('change', () => {
      if (dayChk.checked) nightChk.checked = false;
      ensureOneShift(); renderCalendar();
      if (selectedDate) {
        const [y, mm, d] = selectedDate.split('-').map(Number);
        updateWhatsAppLink(y, mm - 1, d);
      }
    });
    nightChk.addEventListener('change', () => {
      if (nightChk.checked) dayChk.checked = false;
      ensureOneShift(); renderCalendar();
      if (selectedDate) {
        const [y, mm, d] = selectedDate.split('-').map(Number);
        updateWhatsAppLink(y, mm - 1, d);
      }
    });

    renderCalendar();

    // Preseleccionar hoy si está disponible
    if (calendarEl && calendarEl.querySelector('.day.available')) {
      const sameYM = todayKey.startsWith(`${currentYear}-${String(currentMonth+1).padStart(2,'0')}`);
      if (sameYM) {
        const candidate = Array.from(calendarEl.querySelectorAll('.day'))
          .find(b => b.textContent === String(new Date().getDate()) && b.classList.contains('available'));
        if (candidate) candidate.click();
      }
    }

    // Re-render inmediato cuando llegue la data del loader
    document.addEventListener('avdata:loaded', () => {
      renderCalendar();
    });
  });
})();
