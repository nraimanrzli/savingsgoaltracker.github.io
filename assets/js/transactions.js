//  Transactions JS

var myModal;

document.addEventListener("DOMContentLoaded", function () {
  myModal = new bootstrap.Modal(document.getElementById('formModal'));
  renderTable();
});

function getData() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveStorage(data) {
  localStorage.setItem("transactions", JSON.stringify(data));
}

function renderTable() {
  var data  = getData();
  var tbody = document.getElementById("listBody");
  tbody.innerHTML = "";

  document.getElementById("noData").style.display = data.length === 0 ? "block" : "none";

  data.forEach((item, i) => {
    var badge = item.type === "Income" ? "bg-success" : "bg-danger";

    tbody.innerHTML += `
      <tr>
        <td>${item.goal}</td>
        <td><span class="badge ${badge}">${item.type}</span></td>
        <td>RM ${item.amount}</td>
        <td>${item.date}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-primary" onclick="editItem(${i})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger"  onclick="deleteItem(${i})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
  });
}

function openModal() {
  document.getElementById("form").reset();
  document.getElementById("editIndex").value     = "";
  document.getElementById("modalTitle").innerText = "Add Transaction";
  myModal.show();
}

function editItem(i) {
  var d = getData()[i];
  goal.value       = d.goal;
  type.value       = d.type;
  amount.value     = d.amount;
  date.value       = d.date;
  editIndex.value  = i;
  modalTitle.innerText = "Edit Transaction";
  myModal.show();
}

function saveData() {
  var goalVal = goal.value;
  if (!goalVal) {
    Swal.fire("Error", "Fill all fields", "error");
    return;
  }

  var newData = {
    goal   : goalVal,
    type   : type.value,
    amount : amount.value,
    date   : date.value
  };

  var data = getData();
  var idx  = editIndex.value;

  if (idx === "") data.push(newData);
  else            data[idx] = newData;

  saveStorage(data);
  renderTable();
  myModal.hide();

  Swal.fire({ icon: "success", title: "Saved!", timer: 1200, showConfirmButton: false });
}

function deleteItem(i) {
  Swal.fire({ title: "Delete?", icon: "warning", showCancelButton: true })
    .then(res => {
      if (res.isConfirmed) {
        var data = getData();
        data.splice(i, 1);
        saveStorage(data);
        renderTable();
      }
    });
}

function searchTable() {
  var input = searchInput.value.toUpperCase();
  var rows  = listBody.getElementsByTagName("tr");

  for (var i = 0; i < rows.length; i++) {
    rows[i].style.display =
      rows[i].innerText.toUpperCase().includes(input) ? "" : "none";
  }
}
