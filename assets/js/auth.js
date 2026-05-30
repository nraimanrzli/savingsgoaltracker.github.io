function getStoredUser() {
  const password = prompt("Enter new password:");

  if (username && password) {
    const user = {
      username: username,
      password: password
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Registration successful! You can now login.");
  } else {
    alert("Registration cancelled.");
  }
}

function forgotPassword() {
  const savedUser = getStoredUser();

  if (savedUser) {
    alert("Your password is: " + savedUser.password);
  } else {
    alert("Default password is: 1234");
  }
}

function logoutUser() {
  alert("Logged out successfully.");
  window.location.href = "index.html";
}

const ctx = document.getElementById("savingsChart");

if (ctx) {
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
        label: "Savings (RM)",
        data: [500, 800, 1000, 1200, 1500]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}