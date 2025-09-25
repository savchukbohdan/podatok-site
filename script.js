document.addEventListener("DOMContentLoaded", () => {
  // Темна/світла тема
  const toggleBtn = document.getElementById("btnToggle");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
  });

  // Валютний конвертер
  async function convertToCurrency(amountUAH, currencyCode) {
    try {
      const res = await fetch(`https://api.exchangerate.host/latest?base=UAH&symbols=${currencyCode}`);
      const data = await res.json();
      const rate = data.rates[currencyCode];
      return (amountUAH * rate).toFixed(2);
    } catch {
      return null;
    }
  }

  // Калькулятор зарплати
  let salaryChart = null;
  window.calcSalary = async function () {
    const gross = parseFloat(document.getElementById("gross").value);
    if (isNaN(gross) || gross <= 0) {
      document.getElementById("salaryResult").innerHTML = "Введіть коректну суму";
      return;
    }

    const pdf = gross * 0.18;
    const vz = gross * 0.05;
    const net = gross - pdf - vz;
    const esv = gross * 0.22;

    const currency = document.getElementById("currency").value;
    const netConverted = await convertToCurrency(net, currency);

    document.getElementById("salaryResult").innerHTML = `
      <b>Результат:</b><br>
      ПДФО: ${pdf.toFixed(2)} грн<br>
      Військовий збір: ${vz.toFixed(2)} грн<br>
      Зарплата на руки: ${net.toFixed(2)} грн (${netConverted ?? "—"} ${currency})<br>
      Витрати роботодавця (ЄСВ): ${esv.toFixed(2)} грн
    `;

    const ctx = document.getElementById("salaryChart").getContext("2d");
    if (salaryChart) salaryChart.destroy();
    salaryChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["ПДФО", "Військовий збір", "Чиста зарплата", "ЄСВ"],
        datasets: [{
          data: [pdf, vz, net, esv],
          backgroundColor: ['#f44336', '#2196f3', '#4caf50', '#ffeb3b']
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: "#eeeeee" } }
        }
      }
    });
  };

  // Калькулятор ФОП
  let fopChart = null;
  window.calcFOP = async function () {
    const group = document.getElementById("group").value;
    const income = parseFloat(document.getElementById("income").value) || 0;
    const vat = document.getElementById("vat").checked;

    let edp = 0, vz = 0;
    const esv = 1760;

    if (group === "1") {
      edp = 302.80;
      vz = 800;
    } else if (group === "2") {
      edp = 1600;
      vz = 800;
    } else if (group === "3") {
      edp = vat ? income * 0.03 : income * 0.05;
      vz = income * 0.01;
    }

    const total = edp + vz + esv;
    const currency = document.getElementById("currencyFOP").value;
    const totalConverted = await convertToCurrency(total, currency);

    document.getElementById("fopResult").innerHTML = `
      <b>Результат:</b><br>
      Єдиний податок: ${edp.toFixed(2)} грн<br>
      Військовий збір: ${vz.toFixed(2)} грн<br>
      ЄСВ: ${esv.toFixed(2)} грн<br>
      <b>Всього податків на місяць:</b> ${total.toFixed(2)} грн (${totalConverted ?? "—"} ${currency})
    `;

    const ctx = document.getElementById("fopChart").getContext("2d");
    if (fopChart) fopChart.destroy();
    fopChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Єдиний податок", "Військовий збір", "ЄСВ"],
        datasets: [{
          data: [edp, vz, esv],
          backgroundColor: ['#9c27b0', '#ff9800', '#ffeb3b']
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: "#eeeeee" } }
        }
      }
    });
  };

  // 📅 Податковий календар
  const taxDates = {
    "1": {
      "Січень": ["20 - ЄП", "20 - ЄСВ"],
      "Квітень": ["20 - ЄСВ"],
      "Липень": ["20 - ЄСВ"],
      "Жовтень": ["20 - ЄСВ"]
    },
    "2": {
      "Січень": ["20 - ЄП", "20 - ЄСВ"],
      "Квітень": ["20 - ЄП", "20 - ЄСВ"],
      "Липень": ["20 - ЄП", "20 - ЄСВ"],
      "Жовтень": ["20 - ЄП", "20 - ЄСВ"]
    },
    "3": {
      "Січень": ["20 - ЄСВ", "20 - ЄП (кв.)"],
      "Квітень": ["20 - ЄСВ", "20 - ЄП (кв.)"],
      "Травень": ["10 - Декларація"],
      "Липень": ["20 - ЄСВ", "20 - ЄП (кв.)"],
      "Жовтень": ["20 - ЄСВ", "20 - ЄП (кв.)"]
    }
  };

  const months = [
    "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
  ];

  function renderTaxCalendar(group) {
    const calendar = document.getElementById("taxCalendarGrid");
    if (!calendar) return;

    calendar.innerHTML = "";
    const now = new Date();
    const today = now.getDate();
    const currentMonth = months[now.getMonth()];

    months.forEach(month => {
      const monthEl = document.createElement("div");
      monthEl.className = "calendar-month";
      monthEl.innerHTML = `<h4>${month}</h4>`;

      const dates = taxDates[group]?.[month] || [];
      if (dates.length === 0) {
        monthEl.innerHTML += `<div class="tax-date">—</div>`;
      } else {
        dates.forEach(date => {
          const [dayStr, label] = date.split(" - ");
          const day = parseInt(dayStr.trim());

          const isToday = (month === currentMonth && day === today);
          const dateEl = document.createElement("div");
          dateEl.className = "tax-date" + (isToday ? " today" : "");
          dateEl.innerHTML = `${day} — ${label} <span class="remind" title="Нагадати">🔔</span>`;

          dateEl.querySelector(".remind").onclick = () => {
            const key = `remind-${group}-${month}-${day}`;
            localStorage.setItem(key, "true");
            alert(`Нагадування збережено для ${month} ${day}`);
          };

          monthEl.appendChild(dateEl);
        });
      }

      calendar.appendChild(monthEl);
    });
  }

  const groupSelect = document.getElementById("fopGroupFilter");
  if (groupSelect) {
    groupSelect.addEventListener("change", e => {
      renderTaxCalendar(e.target.value);
    });

    // первинний р
