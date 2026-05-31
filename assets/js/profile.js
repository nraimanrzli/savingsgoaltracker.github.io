// =============================================
//  Profile JS
// =============================================

let defaultProfile = {
  name    : "Aiman",
  email   : "Aiman@gmail.com",
  phone   : "+60123456789",
  address : "Teluk Intan, Perak",
  picture : ""
};

function loadProfile() {
  let profile = JSON.parse(localStorage.getItem("savingsProfile")) || defaultProfile;

  document.getElementById("displayName").innerText  = profile.name;
  document.getElementById("displayEmail").innerText = profile.email;
  document.getElementById("displayPhone").innerText = profile.phone;

  document.getElementById("pname").value    = profile.name;
  document.getElementById("pemail").value   = profile.email;
  document.getElementById("pphone").value   = profile.phone;
  document.getElementById("paddress").value = profile.address;

  if (profile.picture) {
    document.getElementById("profilePic").src = profile.picture;
  }

  updateProgress();
}

function changePicture(event) {
  let file = event.target.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = function (e) {
    let base64 = e.target.result;
    document.getElementById("profilePic").src = base64;

    let profile = JSON.parse(localStorage.getItem("savingsProfile")) || defaultProfile;
    profile.picture = base64;
    localStorage.setItem("savingsProfile", JSON.stringify(profile));
  };
  reader.readAsDataURL(file);
}

function updateProfile(e) {
  e.preventDefault();

  let existing = JSON.parse(localStorage.getItem("savingsProfile")) || defaultProfile;

  let profile = {
    name    : document.getElementById("pname").value,
    email   : document.getElementById("pemail").value,
    phone   : document.getElementById("pphone").value,
    address : document.getElementById("paddress").value,
    picture : existing.picture || ""
  };

  localStorage.setItem("savingsProfile", JSON.stringify(profile));
  loadProfile();
  alert("Profile updated successfully!");
}

function updateProgress() {
  let goals = JSON.parse(localStorage.getItem("goals")) || [];
  if (goals.length === 0) return;

  let totalTarget = 0;
  let totalSaved  = 0;

  for (let i = 0; i < goals.length; i++) {
    totalTarget += Number(goals[i].target || 0);
    totalSaved  += Number(goals[i].saved  || 0);
  }

  let percent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  percent = Math.min(percent, 100);

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressBar").innerText   = Math.floor(percent) + "%";
}

window.onload = loadProfile;
