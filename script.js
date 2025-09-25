// 🌗 Темна/світла тема
document.getElementById("btnToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  document.getElementById("btnToggle").textContent = isDark ? "☀️" : "🌙";
});

// 💱 Конвертація валюти
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

// 💰 Калькулятор зарплати
let salaryChart = null;
async function calcSalary() {
  const gross = parseFloat(document.getElementById("gross").value);
  if (isNaN(gross) || gross <= 0) {
    document.getElementById("salaryResult").innerHTML = "Введіть коректну суму
