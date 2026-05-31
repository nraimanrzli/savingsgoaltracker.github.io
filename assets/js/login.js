// =============================================
//  Login Page JS
// =============================================

if (!localStorage.getItem("validUser")) {
  localStorage.setItem("validUser", "admin");
  localStorage.setItem("validPass", "1234");
}

function togglePassword() {
  let input = document.getElementById("password");
  let icon  = document.getElementById("eyeIcon");
  if (input.type === "password") {
    input.type = "text";
    icon.className = "bi bi-eye-slash";
  } else {
    input.type = "password";
    icon.className = "bi bi-eye";
  }
}

function showError(msg) {
  let el = document.getElementById("error");
  el.innerText = msg;
  el.classList.remove("d-none");
}

function hideError() {
  document.getElementById("error").classList.add("d-none");
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  let savedUser = localStorage.getItem("validUser") || "admin";
  let savedPass = localStorage.getItem("validPass") || "1234";

  if (!username || !password) {
    showError("Please enter your username and password.");
    return;
  }

  if (username === savedUser && password === savedPass) {
    hideError();
    Swal.fire({
      title: 'Login Successful!',
      text: 'Welcome to Savings Goal Tracker',
      icon: 'success',
      confirmButtonColor: '#198754'
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  } else {
    showError("Invalid username or password. Access denied.");
  }
}

async function signUp() {
  const { value: formValues } = await Swal.fire({
    title: 'Register New Account',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="New Username">' +
      '<input id="swal-input2" class="swal2-input" type="password" placeholder="New Password">',
    focusConfirm: false,
    confirmButtonText: 'Register',
    confirmButtonColor: '#198754',
    showCancelButton: true,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value
      ];
    }
  });

  if (formValues) {
    const [newUser, newPass] = formValues;
    if (newUser && newPass) {
      localStorage.setItem("validUser", newUser);
      localStorage.setItem("validPass", newPass);
      Swal.fire({ title: 'Success!', text: 'Account created! Please login.', icon: 'success', confirmButtonColor: '#198754' });
    } else {
      Swal.fire('Error', 'Please enter both username and password', 'error');
    }
  }
}

async function forgotPass() {
  const { value: email } = await Swal.fire({
    title: 'Reset Password',
    input: 'email',
    inputLabel: 'Enter your registered email',
    inputPlaceholder: 'example@email.com',
    confirmButtonColor: '#198754',
    showCancelButton: true
  });

  if (email) {
    const { value: password } = await Swal.fire({
      title: 'New Password',
      input: 'password',
      inputLabel: 'Enter your new password',
      inputPlaceholder: 'New Password',
      confirmButtonColor: '#198754',
      showCancelButton: true
    });

    if (password) {
      localStorage.setItem("validPass", password);
      Swal.fire({ title: 'Success!', text: 'Password reset successful. Please login again.', icon: 'success', confirmButtonColor: '#198754' });
    }
  }
}

document.getElementById("password").addEventListener("keypress", function (e) {
  if (e.key === "Enter") login();
});

document.getElementById("username").addEventListener("keypress", function (e) {
  if (e.key === "Enter") document.getElementById("password").focus();
});
