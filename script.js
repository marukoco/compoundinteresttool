// Final版 script.js，加入 Chart.js 图表渲染功能
let resultChart;

function renderChart(yearsArray, totalArray, principalArray) {
  const ctx = document.getElementById("resultChart")?.getContext("2d");
  if (!ctx) return;
  if (resultChart) resultChart.destroy();

  resultChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: yearsArray,
      datasets: [
        {
          label: "Total Value",
          data: totalArray,
          borderColor: "#007acc",
          fill: false,
          tension: 0.3
        },
        {
          label: "Principal Only",
          data: principalArray,
          borderColor: "#999",
          borderDash: [5, 5],
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

document.getElementById("interest-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const principal = parseFloat(document.getElementById("principal").value);
  const rate = parseFloat(document.getElementById("rate").value) / 100;
  const years = parseFloat(document.getElementById("years").value);
  const frequency = parseInt(document.getElementById("frequency").value);
  const pmt = parseFloat(document.getElementById("recurringAmount").value);
  const freq = parseFloat(document.getElementById("contributionFrequency").value);

  if (isNaN(principal) || isNaN(rate) || isNaN(years) || isNaN(frequency)) {
    alert("Please fill in all required fields correctly.");
    return;
  }

  const totalPrincipal = principal * Math.pow(1 + rate / frequency, frequency * years);
  let totalRecurring = 0;
  if (!isNaN(pmt) && !isNaN(freq) && freq > 0 && rate > 0) {
    totalRecurring = pmt * ((Math.pow(1 + rate / freq, freq * years) - 1) / (rate / freq));
  }

  const total = totalPrincipal + totalRecurring;
  const interest = total - (principal + (pmt * freq * years || 0));

  document.getElementById("total-value").textContent = total.toFixed(2);
  document.getElementById("initial-value").textContent = principal.toFixed(2);
  document.getElementById("recurring-value").textContent = totalRecurring.toFixed(2);
  document.getElementById("duration-value").textContent = years;
  document.getElementById("interest-value").textContent = interest.toFixed(2);
  document.getElementById("result").style.display = "block";

  // 生成图表数据
  const yearLabels = [];
  const totalSeries = [];
  const principalSeries = [];
  for (let i = 1; i <= Math.ceil(years); i++) {
    yearLabels.push(`Year ${i}`);
    const partialPrincipal = principal * Math.pow(1 + rate / frequency, frequency * i);
    let partialRecurring = 0;
    if (!isNaN(pmt) && !isNaN(freq) && freq > 0 && rate > 0) {
      partialRecurring = pmt * ((Math.pow(1 + rate / freq, freq * i) - 1) / (rate / freq));
    }
    principalSeries.push(Number(partialPrincipal.toFixed(2)));
    totalSeries.push(Number((partialPrincipal + partialRecurring).toFixed(2)));
  }
  renderChart(yearLabels, totalSeries, principalSeries);
});

document.getElementById("clearBtn").addEventListener("click", function () {
  document.getElementById("interest-form").reset();
  document.getElementById("result").style.display = "none";
  if (resultChart) resultChart.destroy();
});

document.getElementById("copyBtn")?.addEventListener("click", function () {
  const summary = `Compound Interest Result:\n- Total: $${document.getElementById("total-value").textContent}\n- Initial: $${document.getElementById("initial-value").textContent}\n- Recurring: $${document.getElementById("recurring-value").textContent}\n- Years: ${document.getElementById("duration-value").textContent}`;
  navigator.clipboard.writeText(summary);
  alert("Summary copied to clipboard!");
});
