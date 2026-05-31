// =============================================
//  Savings Goals JS
// =============================================

function getData() {
  return JSON.parse(localStorage.getItem("goals")) || [];
}

function saveStorage(data) {
  localStorage.setItem("goals", JSON.stringify(data));
}

function renderTable() {
  let data  = getData();
  let tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  document.getElementById("emptyState").classList.toggle("d-none", data.length !== 0);

  data.forEach(function (item, i) {
    let tgt   = Number(item.target) || 0;
    let sav   = Number(item.saved)  || 0;
    let pct   = tgt > 0 ? Math.min((sav / tgt) * 100, 100) : 0;
    let color = item.status === "Completed" ? "success" :
                item.status === "Delayed"   ? "danger"  : "warning";

    tbody.innerHTML += `
      <tr>
        <td><strong>${item.goalName}</strong></td>
        <td>RM ${tgt.toLocaleString()}</td>
        <td>RM ${sav.toLocaleString()}</td>
        <td>
          <div class="progress" style="height:22px;">
            <div class="progress-bar bg-success" style="width:${pct}%">${pct.toFixed(0)}%</div>
          </div>
        </td>
        <td>${item.deadline || "-"}</td>
        <td><span class="badge bg-${color}">${item.status}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-primary" onclick="editItem(${i})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger"  onclick="deleteItem(${i})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
  });
}

function openModal() {
  document.getElementById("editIndex").value      = "";
  document.getElementById("goalName").value       = "";
  document.getElementById("target").value         = "";
  document.getElementById("saved").value          = "";
  document.getElementById("deadline").value       = "";
  document.getElementById("status").value         = "In Progress";
  document.getElementById("modalTitle").innerText = "Add Savings Goal";
  new bootstrap.Modal(document.getElementById("goalModal")).show();
}

function editItem(i) {
  let item = getData()[i];
  document.getElementById("goalName").value       = item.goalName;
  document.getElementById("target").value         = item.target;
  document.getElementById("saved").value          = item.saved;
  document.getElementById("deadline").value       = item.deadline;
  document.getElementById("status").value         = item.status;
  document.getElementById("editIndex").value      = i;
  document.getElementById("modalTitle").innerText = "Edit Savings Goal";
  new bootstrap.Modal(document.getElementById("goalModal")).show();
}

function saveData() {
  let data = getData();
  let item = {
    goalName : document.getElementById("goalName").value,
    target   : document.getElementById("target").value,
    saved    : document.getElementById("saved").value,
    deadline : document.getElementById("deadline").value,
    status   : document.getElementById("status").value
  };

  if (!item.goalName || !item.target) {
    Swal.fire("Error", "Please fill all required fields", "error");
    return;
  }

  let index = document.getElementById("editIndex").value;
  if (index === "") { data.push(item); }
  else              { data[index] = item; }

  saveStorage(data);

  let modalEl  = document.getElementById("goalModal");
  let instance = bootstrap.Modal.getInstance(modalEl);
  if (instance) instance.hide();

  renderTable();
  Swal.fire({ icon: "success", title: "Saved!", text: "Savings goal updated successfully", timer: 1500, showConfirmButton: false });
}

function deleteItem(i) {
  Swal.fire({ title: "Delete this goal?", text: "This action cannot be undone.", icon: "warning", showCancelButton: true })
    .then(function (result) {
      if (result.isConfirmed) {
        let data = getData();
        data.splice(i, 1);
        saveStorage(data);
        renderTable();
        Swal.fire({ icon: "success", title: "Deleted!", timer: 1200, showConfirmButton: false });
      }
    });
}

function searchTable() {
  let input = document.getElementById("searchInput").value.toUpperCase();
  document.querySelectorAll("#tableBody tr").forEach(function (row) {
    row.style.display = row.innerText.toUpperCase().includes(input) ? "" : "none";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderTable();
});
