// =============================================
// dashboard.js — shared across dashboard pages
// =============================================

// Read role from sessionStorage and display in navbar
var role = sessionStorage.getItem('selectedRole');

if (role) {
  var roleLabel = document.getElementById('navbar-role');
  if (roleLabel) {
    roleLabel.textContent = role;
  }
}