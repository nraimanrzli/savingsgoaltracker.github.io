//  Shared Utilities — datetime & logout


function updateDateTime() {
  var el = document.getElementById("datetime");
  if (el) {
    el.innerText = new Date().toLocaleString('en-MY', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
setInterval(updateDateTime, 1000);
updateDateTime();

function logout() {
  alert('Logged out successfully');
  window.location.href = 'index.html';
}
