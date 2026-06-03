// =============================================
//  analytics.js
//  3 sections: Budget Planner, Monthly Savings, Reminders
//  localStorage keys:
//    "budgets"        → feeds Polar Area chart (dashboard)
//    "monthlySavings" → feeds Line chart (dashboard)
//    "reminders"      → feeds Radar chart (dashboard)
// =============================================

// ── Generic table search ──────────────────────
function searchTable(inputId, bodyId) {
  var input = document.getElementById(inputId).value.toUpperCase();
  document.querySelectorAll('#' + bodyId + ' tr').forEach(function (row) {
    row.style.display = row.innerText.toUpperCase().includes(input) ? '' : 'none';
  });
}

// ═══════════════════════════════════════════════
//  SECTION 1 — BUDGET PLANNER
// ═══════════════════════════════════════════════
function getBudgets()      { return JSON.parse(localStorage.getItem('budgets'))  || []; }
function saveBudgets(data) { localStorage.setItem('budgets', JSON.stringify(data)); }

function renderBudgetTable() {
  var data  = getBudgets();
  var tbody = document.getElementById('budgetBody');
  tbody.innerHTML = '';

  var emptyEl = document.getElementById('budgetEmpty');
  if (emptyEl) emptyEl.classList.toggle('d-none', data.length !== 0);

  data.forEach(function (item, i) {
    var budgeted = parseFloat(item.amount || 0);
    var actual   = parseFloat(item.actual  || 0);
    var pct      = budgeted > 0 ? Math.min((actual / budgeted) * 100, 100) : 0;
    var over     = actual > budgeted;
    var barColor = over ? 'bg-danger' : pct >= 80 ? 'bg-warning' : 'bg-success';
    var badge    = over
      ? '<span class="badge bg-danger">Over Budget</span>'
      : pct >= 80
        ? '<span class="badge bg-warning text-dark">Near Limit</span>'
        : '<span class="badge bg-success">On Track</span>';

    tbody.innerHTML += `
      <tr>
        <td><strong>${item.category}</strong></td>
        <td>RM ${budgeted.toLocaleString()}</td>
        <td>RM ${actual.toLocaleString()}</td>
        <td>
          <div class="progress" style="height:22px;">
            <div class="progress-bar ${barColor}" style="width:${pct}%">${pct.toFixed(0)}%</div>
          </div>
        </td>
        <td>${item.month || '-'}</td>
        <td>${badge}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-primary" onclick="editBudget(${i})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger"  onclick="deleteBudget(${i})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
  });
}

function openBudgetModal() {
  document.getElementById('budgetEditIndex').value       = '';
  document.getElementById('budgetCategory').value       = '';
  document.getElementById('budgetAmount').value         = '';
  document.getElementById('budgetActual').value         = '';
  document.getElementById('budgetMonth').value          = '';
  document.getElementById('budgetModalTitle').innerText = 'Add Budget';
  new bootstrap.Modal(document.getElementById('budgetModal')).show();
}

function editBudget(i) {
  var item = getBudgets()[i];
  document.getElementById('budgetCategory').value       = item.category;
  document.getElementById('budgetAmount').value         = item.amount;
  document.getElementById('budgetActual').value         = item.actual;
  document.getElementById('budgetMonth').value          = item.month;
  document.getElementById('budgetEditIndex').value      = i;
  document.getElementById('budgetModalTitle').innerText = 'Edit Budget';
  new bootstrap.Modal(document.getElementById('budgetModal')).show();
}

function saveBudget() {
  var category = document.getElementById('budgetCategory').value.trim();
  var amount   = document.getElementById('budgetAmount').value;
  var actual   = document.getElementById('budgetActual').value;
  var month    = document.getElementById('budgetMonth').value;

  if (!category || !amount) {
    Swal.fire('Validation Error', 'Please fill in Category and Budgeted Amount.', 'error');
    return;
  }

  var data  = getBudgets();
  var item  = { category: category, amount: amount, actual: actual || '0', month: month };
  var index = document.getElementById('budgetEditIndex').value;

  if (index === '') data.push(item);
  else              data[parseInt(index)] = item;

  saveBudgets(data);
  bootstrap.Modal.getInstance(document.getElementById('budgetModal')).hide();
  renderBudgetTable();
  Swal.fire({ icon: 'success', title: 'Saved!', timer: 1400, showConfirmButton: false });
}

function deleteBudget(i) {
  Swal.fire({ title: 'Delete this budget?', icon: 'warning', showCancelButton: true,
              confirmButtonColor: '#dc3545' })
    .then(function (res) {
      if (res.isConfirmed) {
        var data = getBudgets();
        data.splice(i, 1);
        saveBudgets(data);
        renderBudgetTable();
        Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1200, showConfirmButton: false });
      }
    });
}

// ═══════════════════════════════════════════════
//  SECTION 2 — MONTHLY SAVINGS LOG
// ═══════════════════════════════════════════════
function getMonthlySavings()      { return JSON.parse(localStorage.getItem('monthlySavings'))  || []; }
function saveMonthlySavings(data) { localStorage.setItem('monthlySavings', JSON.stringify(data)); }

function renderSavingsTable() {
  var data  = getMonthlySavings();
  var tbody = document.getElementById('savingsBody');
  tbody.innerHTML = '';

  var emptyEl = document.getElementById('savingsEmpty');
  if (emptyEl) emptyEl.classList.toggle('d-none', data.length !== 0);

  // Sort by month ascending
  var sorted = data.map(function (item, i) { return { item: item, i: i }; })
    .sort(function (a, b) { return a.item.month > b.item.month ? 1 : -1; });

  sorted.forEach(function (obj) {
    var item    = obj.item;
    var i       = obj.i;
    var income  = parseFloat(item.income  || 0);
    var expense = parseFloat(item.expense || 0);
    var net     = income - expense;
    var netColor = net >= 0 ? 'text-success' : 'text-danger';

    tbody.innerHTML += `
      <tr>
        <td><strong>${item.month}</strong></td>
        <td>RM ${income.toLocaleString()}</td>
        <td>RM ${expense.toLocaleString()}</td>
        <td class="${netColor} fw-bold">RM ${net.toLocaleString()}</td>
        <td>${item.note || '-'}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-primary" onclick="editSavingsEntry(${i})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger"  onclick="deleteSavingsEntry(${i})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
  });
}

function openSavingsModal() {
  document.getElementById('savingsEditIndex').value       = '';
  document.getElementById('savingsMonth').value          = '';
  document.getElementById('savingsIncome').value         = '';
  document.getElementById('savingsExpense').value        = '';
  document.getElementById('savingsNote').value           = '';
  document.getElementById('savingsModalTitle').innerText = 'Add Monthly Entry';
  new bootstrap.Modal(document.getElementById('savingsModal')).show();
}

function editSavingsEntry(i) {
  var item = getMonthlySavings()[i];
  document.getElementById('savingsMonth').value          = item.month;
  document.getElementById('savingsIncome').value         = item.income;
  document.getElementById('savingsExpense').value        = item.expense;
  document.getElementById('savingsNote').value           = item.note || '';
  document.getElementById('savingsEditIndex').value      = i;
  document.getElementById('savingsModalTitle').innerText = 'Edit Monthly Entry';
  new bootstrap.Modal(document.getElementById('savingsModal')).show();
}

function saveSavingsEntry() {
  var month   = document.getElementById('savingsMonth').value;
  var income  = document.getElementById('savingsIncome').value;
  var expense = document.getElementById('savingsExpense').value;
  var note    = document.getElementById('savingsNote').value;

  if (!month || !income || !expense) {
    Swal.fire('Validation Error', 'Please fill in Month, Income and Expense.', 'error');
    return;
  }

  var data  = getMonthlySavings();
  var item  = { month: month, income: income, expense: expense, note: note };
  var index = document.getElementById('savingsEditIndex').value;

  if (index === '') data.push(item);
  else              data[parseInt(index)] = item;

  saveMonthlySavings(data);
  bootstrap.Modal.getInstance(document.getElementById('savingsModal')).hide();
  renderSavingsTable();
  Swal.fire({ icon: 'success', title: 'Saved!', timer: 1400, showConfirmButton: false });
}

function deleteSavingsEntry(i) {
  Swal.fire({ title: 'Delete this entry?', icon: 'warning', showCancelButton: true,
              confirmButtonColor: '#dc3545' })
    .then(function (res) {
      if (res.isConfirmed) {
        var data = getMonthlySavings();
        data.splice(i, 1);
        saveMonthlySavings(data);
        renderSavingsTable();
        Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1200, showConfirmButton: false });
      }
    });
}

// ═══════════════════════════════════════════════
//  SECTION 3 — REMINDERS
// ═══════════════════════════════════════════════
function getReminders()      { return JSON.parse(localStorage.getItem('reminders'))  || []; }
function saveReminders(data) { localStorage.setItem('reminders', JSON.stringify(data)); }

function renderReminderTable() {
  var data  = getReminders();
  var tbody = document.getElementById('reminderBody');
  tbody.innerHTML = '';

  var emptyEl = document.getElementById('reminderEmpty');
  if (emptyEl) emptyEl.classList.toggle('d-none', data.length !== 0);

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  data.forEach(function (item, i) {
    var due      = new Date(item.date);
    var diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    var overdue  = diffDays < 0;
    var soon     = diffDays >= 0 && diffDays <= 3;

    var priorityColor = item.priority === 'High' ? 'danger'
                      : item.priority === 'Medium' ? 'warning' : 'success';
    var statusBadge = overdue
      ? '<span class="badge bg-danger">Overdue</span>'
      : soon
        ? '<span class="badge bg-warning text-dark">Due Soon</span>'
        : `<span class="badge bg-secondary">${diffDays}d left</span>`;

    tbody.innerHTML += `
      <tr>
        <td><strong>${item.title}</strong></td>
        <td>${item.category || '-'}</td>
        <td>RM ${parseFloat(item.amount || 0).toLocaleString()}</td>
        <td>${item.date}</td>
        <td><span class="badge bg-${priorityColor}${item.priority === 'Medium' ? ' text-dark' : ''}">${item.priority}</span></td>
        <td>${statusBadge}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-primary" onclick="editReminder(${i})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger"  onclick="deleteReminder(${i})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
  });
}

function openReminderModal() {
  document.getElementById('reminderEditIndex').value       = '';
  document.getElementById('reminderTitle').value          = '';
  document.getElementById('reminderCategory').value       = '';
  document.getElementById('reminderAmount').value         = '';
  document.getElementById('reminderDate').value           = '';
  document.getElementById('reminderPriority').value       = 'Medium';
  document.getElementById('reminderModalTitle').innerText = 'Add Reminder';
  new bootstrap.Modal(document.getElementById('reminderModal')).show();
}

function editReminder(i) {
  var item = getReminders()[i];
  document.getElementById('reminderTitle').value          = item.title;
  document.getElementById('reminderCategory').value       = item.category || '';
  document.getElementById('reminderAmount').value         = item.amount || '';
  document.getElementById('reminderDate').value           = item.date;
  document.getElementById('reminderPriority').value       = item.priority;
  document.getElementById('reminderEditIndex').value      = i;
  document.getElementById('reminderModalTitle').innerText = 'Edit Reminder';
  new bootstrap.Modal(document.getElementById('reminderModal')).show();
}

function saveReminder() {
  var title    = document.getElementById('reminderTitle').value.trim();
  var category = document.getElementById('reminderCategory').value.trim();
  var amount   = document.getElementById('reminderAmount').value;
  var date     = document.getElementById('reminderDate').value;
  var priority = document.getElementById('reminderPriority').value;

  if (!title || !date) {
    Swal.fire('Validation Error', 'Please fill in Title and Due Date.', 'error');
    return;
  }

  var data  = getReminders();
  var item  = { title: title, category: category, amount: amount || '0', date: date, priority: priority };
  var index = document.getElementById('reminderEditIndex').value;

  if (index === '') data.push(item);
  else              data[parseInt(index)] = item;

  saveReminders(data);
  bootstrap.Modal.getInstance(document.getElementById('reminderModal')).hide();
  renderReminderTable();
  Swal.fire({ icon: 'success', title: 'Saved!', timer: 1400, showConfirmButton: false });
}

function deleteReminder(i) {
  Swal.fire({ title: 'Delete this reminder?', icon: 'warning', showCancelButton: true,
              confirmButtonColor: '#dc3545' })
    .then(function (res) {
      if (res.isConfirmed) {
        var data = getReminders();
        data.splice(i, 1);
        saveReminders(data);
        renderReminderTable();
        Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1200, showConfirmButton: false });
      }
    });
}

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  renderBudgetTable();
  renderSavingsTable();
  renderReminderTable();
});
