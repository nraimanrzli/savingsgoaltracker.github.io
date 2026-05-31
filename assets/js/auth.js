function login() {
    var inputUser = document.getElementById("username").value;
    var inputPass = document.getElementById("password").value;
    var errorMsg = document.getElementById("error");

    var registeredUser = localStorage.getItem("validUser") || "student";
    
    var registeredPass = localStorage.getItem("validPass") || "123456";

    console.log("--- DEBUG LOGIN ---");
    console.log("Input Username:", inputUser);
    console.log("Input Password:", inputPass);
    console.log("System Username (Storage):", registeredUser);
    console.log("System Password (Storage):", registeredPass);

    if (inputUser === registeredUser && inputPass === registeredPass) {
        console.log("Login: SUCCESS!");
        
        localStorage.setItem("login", "true");
        
        localStorage.setItem("currentUser", inputUser);

        window.location = "dashboard.html";
    } else {
        console.log("Login: FAILED.");
        errorMsg.innerText = "Invalid username or password";
    }
}

function checkLogin() {
    if (localStorage.getItem("login") !== "true") {
        window.location = "index.html";
    }
}

function logout() {
    var confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        localStorage.removeItem("login");
        window.location = "index.html";
    }
}