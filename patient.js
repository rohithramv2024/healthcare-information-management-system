// =============================================
// patient.js — Patient module tab switching
// =============================================


// Grab all tab buttons and all tab content sections
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {

    // Remove active from all buttons and contents
    tabBtns.forEach(function(b) { b.classList.remove('active'); });
    tabContents.forEach(function(c) { c.classList.remove('active'); });

    // Add active to the clicked button
    btn.classList.add('active');

    // Show the matching content section
    const target = btn.getAttribute('data-tab');
    document.getElementById(target).classList.add('active');
  });
});
