// =============================================
// role.js — role.html
// =============================================


// --- SAVE SELECTED ROLE TO SESSIONSTORAGE ---
// When a role card is clicked, save the role name
// to sessionStorage before navigating to that dashboard.

const roleCards = document.querySelectorAll('.role-card');

roleCards.forEach(function(card) {
  card.addEventListener('click', function() {
    const roleName = card.querySelector('h2').textContent;
    sessionStorage.setItem('selectedRole', roleName);
  });
});
