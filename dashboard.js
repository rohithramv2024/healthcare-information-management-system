

// --- ROLE-BASED SIDEBAR LINKS ---
// Defines which links each role sees in the sidebar
const roleModules = {
  'Admin': [
    { label: 'Dashboard',          href: 'admin.html' },
    { label: 'Patient Records',    href: 'patient-records.html' },
    { label: 'Appointments',       href: 'appointments.html' },
    { label: 'Billing',            href: 'billing.html' },
    { label: 'Reports & Analytics',href: 'reports.html' }
  ],
  'Doctor': [
    { label: 'Dashboard',          href: 'doctor.html' },
    { label: 'Patient Records',    href: 'patient-records.html' },
    { label: 'Appointments',       href: 'appointments.html' }
  ],
  'Patient': [
    { label: 'Dashboard',          href: 'patient.html' },
    { label: 'Appointments',       href: 'appointments.html' },
    { label: 'Billing',            href: 'billing.html' }
  ]
};


// --- READ ROLE FROM SESSIONSTORAGE ---
const role = sessionStorage.getItem('selectedRole') || 'Admin';

// Set the role label in the sidebar
const roleLabel = document.getElementById('sidebar-role');
if (roleLabel) {
  roleLabel.textContent = role;
}


// --- BUILD SIDEBAR LINKS DYNAMICALLY ---
const sidebarNav = document.getElementById('sidebar-nav');
const currentPage = window.location.pathname.split('/').pop(); // e.g. "appointments.html"

if (sidebarNav) {
  const links = roleModules[role] || roleModules['Admin'];

  links.forEach(function(item) {
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    a.classList.add('sidebar-link');

    // Highlight the link matching the current page
    if (item.href === currentPage) {
      a.classList.add('active');
    }

    sidebarNav.appendChild(a);
  });
}


