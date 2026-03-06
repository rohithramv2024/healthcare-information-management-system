// =============================================
// patient.js — Patient module tab switching
// =============================================

var tabBtns     = document.querySelectorAll('.tab-btn');
var tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {

    // Hide all content sections
    tabContents.forEach(function(content) {
      content.style.display = 'none';
    });

    // Reset all button styles
    tabBtns.forEach(function(b) {
      b.style.color        = '#666';
      b.style.borderBottom = '3px solid transparent';
      b.style.fontWeight   = 'normal';
    });

    // Highlight the clicked button
    btn.style.color        = '#0066cc';
    btn.style.borderBottom = '3px solid #0066cc';
    btn.style.fontWeight   = 'bold';

    // Show the matching content section
    var target = btn.getAttribute('data-tab');
    document.getElementById(target).style.display = 'block';

  });
});
