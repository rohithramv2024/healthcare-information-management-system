// =============================================
// main.js — index.html
// =============================================


// --- CONTACT FORM VALIDATION ---
const contactForm = document.querySelector('form');

if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Check required fields are not empty
    if (name === '' || email === '' || message === '') {
      showFormMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Regex email format check
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }

    // Success
    showFormMessage('Thank you! Your message has been sent.', 'success');
    contactForm.reset();
  });
}

// Creates or updates the feedback message below the form
function showFormMessage(text, type) {
  let msgEl = document.getElementById('form-message');

  if (!msgEl) {
    msgEl = document.createElement('p');
    msgEl.id = 'form-message';
    contactForm.appendChild(msgEl);
  }

  msgEl.textContent = text;
  msgEl.style.marginTop  = '12px';
  msgEl.style.fontWeight = 'bold';
  msgEl.style.color = (type === 'success') ? '#198754' : '#dc3545';
}
