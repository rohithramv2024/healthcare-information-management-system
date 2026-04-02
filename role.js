// =============================================
// role.js — role.html
// =============================================

var roleCards = document.querySelectorAll('.role-card');

for (var i = 0; i < roleCards.length; i++) {
  roleCards[i].addEventListener('click', function() {
    var roleName = this.querySelector('h2').textContent;
    sessionStorage.setItem('selectedRole', roleName);
  });
}