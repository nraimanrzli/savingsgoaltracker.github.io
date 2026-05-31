// =============================================
//  Dashboard JS
// =============================================

window.onload = function () {

  // Load profile name
  let profile = JSON.parse(localStorage.getItem("savingsProfile"));
  if (profile && profile.name) {
    document.getElementById("welcomeName").innerText = profile.name;
  }

  // Load goals
  let goals = JSON.parse(localStorage.getItem("goals")) || [];

  let totalSavings = goals.reduce((sum, g) => sum + parseFloat(g.saved || 0), 0);
  let completed    = goals.filter(g => g.status === "Completed").length;
  let delayed      = goals.filter(g => g.status === "Delayed").length;
  let inProgress   = goals.filter(g => g.status === "In Progress").length;

  document.getElementById("totalSavings").innerText  = "RM " + totalSavings.toLocaleString();
  document.getElementById("completedGoals").innerText = completed;
  document.getElementById("pendingGoals").innerText   = inProgress + delayed;

  const hasGoals = (completed + inProgress + delayed) > 0;

  new Chart(document.getElementById("statusChart"), {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'In Progress', 'Delayed'],
      datasets: [{
        data: hasGoals ? [completed, inProgress, delayed] : [1, 0, 0],
        backgroundColor: hasGoals
          ? ['#198754', '#ffc107', '#dc3545']
          : ['#e0e0e0', '#e0e0e0', '#e0e0e0']
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: ctx => hasGoals ? ` ${ctx.label}: ${ctx.raw}` : ' No goals yet'
          }
        }
      }
    }
  });

  // Income vs Expense Bar Chart
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let totalIncome = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  let totalExpense = transactions
    .filter(t => t.type === "Expense")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  new Chart(document.getElementById("transactionChart"), {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Amount (RM)',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#198754', '#dc3545'],
        borderRadius: 5
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

};
