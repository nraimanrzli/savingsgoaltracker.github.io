// =============================================
//  dashboard.js
//  Original: doughnut (goals) + bar (transactions)
//  Analytics: line (monthlySavings) + polar (budgets) + radar (reminders)
// =============================================

window.onload = function () {

  // ── Profile name ─────────────────────────────
  var profile = JSON.parse(localStorage.getItem('savingsProfile'));
  if (profile && profile.name) {
    document.getElementById('welcomeName').innerText = profile.name;
  }

  // ── Summary cards ────────────────────────────
  var goals = JSON.parse(localStorage.getItem('goals')) || [];

  var totalSavings = goals.reduce(function (sum, g) {
    return sum + parseFloat(g.saved || 0);
  }, 0);
  var completed  = goals.filter(function (g) { return g.status === 'Completed';  }).length;
  var delayed    = goals.filter(function (g) { return g.status === 'Delayed';    }).length;
  var inProgress = goals.filter(function (g) { return g.status === 'In Progress';}).length;

  document.getElementById('totalSavings').innerText   = 'RM ' + totalSavings.toLocaleString();
  document.getElementById('completedGoals').innerText = completed;
  document.getElementById('pendingGoals').innerText   = inProgress + delayed;

  // ═══════════════════════════════════════════
  //  CHART 1: Doughnut — Goal Completion Status
  // ═══════════════════════════════════════════
  var hasGoals = (completed + inProgress + delayed) > 0;

  new Chart(document.getElementById('statusChart'), {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'In Progress', 'Delayed'],
      datasets: [{
        data: hasGoals ? [completed, inProgress, delayed] : [1, 0, 0],
        backgroundColor: hasGoals
          ? ['#198754', '#ffc107', '#dc3545']
          : ['#e0e0e0', '#e0e0e0', '#e0e0e0'],
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return hasGoals ? ' ' + ctx.label + ': ' + ctx.raw : ' No goals yet';
            }
          }
        }
      }
    }
  });

  // ═══════════════════════════════════════════
  //  CHART 2: Bar — Income vs Expense
  // ═══════════════════════════════════════════
  var transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  var totalIncome = transactions
    .filter(function (t) { return t.type === 'Income'; })
    .reduce(function (sum, t) { return sum + parseFloat(t.amount || 0); }, 0);

  var totalExpense = transactions
    .filter(function (t) { return t.type === 'Expense'; })
    .reduce(function (sum, t) { return sum + parseFloat(t.amount || 0); }, 0);

  new Chart(document.getElementById('transactionChart'), {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Amount (RM)',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#198754', '#dc3545'],
        borderRadius: 5,
        borderSkipped: false
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales:  { y: { beginAtZero: true } }
    }
  });

  // ═══════════════════════════════════════════
  //  CHART 3: Line — Monthly Savings Trend
  //  Reads "monthlySavings" set by analytics.js
  // ═══════════════════════════════════════════
  var monthlySavings = JSON.parse(localStorage.getItem('monthlySavings')) || [];
  monthlySavings.sort(function (a, b) { return a.month > b.month ? 1 : -1; });

  var lineLabels  = monthlySavings.length
    ? monthlySavings.map(function (m) { return m.month; })
    : ['No Data'];

  var lineIncome  = monthlySavings.length
    ? monthlySavings.map(function (m) { return parseFloat(m.income  || 0); })
    : [0];

  var lineExpense = monthlySavings.length
    ? monthlySavings.map(function (m) { return parseFloat(m.expense || 0); })
    : [0];

  var lineNet = monthlySavings.length
    ? monthlySavings.map(function (m) {
        return +(parseFloat(m.income || 0) - parseFloat(m.expense || 0)).toFixed(2);
      })
    : [0];

  new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: lineLabels,
      datasets: [
        {
          label: 'Net Savings (RM)',
          data: lineNet,
          borderColor: '#198754',
          backgroundColor: 'rgba(25,135,84,0.12)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: '#198754'
        },
        {
          label: 'Income (RM)',
          data: lineIncome,
          borderColor: '#0d6efd',
          backgroundColor: 'transparent',
          tension: 0.4,
          borderDash: [5, 4],
          pointRadius: 4,
          pointBackgroundColor: '#0d6efd'
        },
        {
          label: 'Expense (RM)',
          data: lineExpense,
          borderColor: '#dc3545',
          backgroundColor: 'transparent',
          tension: 0.4,
          borderDash: [5, 4],
          pointRadius: 4,
          pointBackgroundColor: '#dc3545'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: { ticks: { autoSkip: false, maxRotation: 45 } },
        y: {
          beginAtZero: true,
          ticks: { callback: function (v) { return 'RM ' + v; } }
        }
      }
    }
  });

  // ═══════════════════════════════════════════
  //  CHART 4: Polar Area — Budget Allocation
  //  Reads "budgets" set by analytics.js
  // ═══════════════════════════════════════════
  var budgets = JSON.parse(localStorage.getItem('budgets')) || [];

  var palette = [
    'rgba(13,110,253,0.75)',  'rgba(25,135,84,0.75)',
    'rgba(255,193,7,0.75)',   'rgba(220,53,69,0.75)',
    'rgba(111,66,193,0.75)',  'rgba(13,202,240,0.75)',
    'rgba(253,126,20,0.75)',  'rgba(32,201,151,0.75)'
  ];

  var polarLabels = budgets.length
    ? budgets.map(function (b) { return b.category; })
    : ['No Data'];

  var polarData = budgets.length
    ? budgets.map(function (b) { return parseFloat(b.amount || 0); })
    : [1];

  new Chart(document.getElementById('polarChart'), {
    type: 'polarArea',
    data: {
      labels: polarLabels,
      datasets: [{
        data: polarData,
        backgroundColor: polarLabels.map(function (_, i) { return palette[i % palette.length]; }),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
    }
  });

  // ═══════════════════════════════════════════
  //  CHART 5: Radar — Reminders by Priority
  //  Reads "reminders" set by analytics.js
  // ═══════════════════════════════════════════
  var reminders = JSON.parse(localStorage.getItem('reminders')) || [];

  function sumByPriority(level) {
    return reminders
      .filter(function (r) { return r.priority === level; })
      .reduce(function (s, r) { return s + parseFloat(r.amount || 0); }, 0);
  }
  function countByPriority(level) {
    return reminders.filter(function (r) { return r.priority === level; }).length;
  }

  new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
      labels: ['High Priority', 'Medium Priority', 'Low Priority'],
      datasets: [
        {
          label: 'Total Amount (RM)',
          data: [sumByPriority('High'), sumByPriority('Medium'), sumByPriority('Low')],
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220,53,69,0.15)',
          pointBackgroundColor: '#dc3545',
          pointRadius: 4
        },
        {
          label: 'Count',
          data: [countByPriority('High'), countByPriority('Medium'), countByPriority('Low')],
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13,110,253,0.15)',
          pointBackgroundColor: '#0d6efd',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        r: {
          beginAtZero: true,
          ticks: { display: false },
          pointLabels: { font: { size: 11 } }
        }
      }
    }
  });

};
