// =============================================
// admin.js — Admin module
// =============================================


// --- TAB SWITCHING ---

var tabBtns     = document.querySelectorAll('.tab-btn');
var tabContents = document.querySelectorAll('.tab-content');

for (var i = 0; i < tabBtns.length; i++) {
  tabBtns[i].addEventListener('click', function() {
    for (var j = 0; j < tabContents.length; j++) {
      tabContents[j].style.display = 'none';
    }
    for (var k = 0; k < tabBtns.length; k++) {
      tabBtns[k].style.color        = '#666';
      tabBtns[k].style.borderBottom = '3px solid transparent';
      tabBtns[k].style.fontWeight   = 'normal';
    }
    this.style.color        = '#0066cc';
    this.style.borderBottom = '3px solid #0066cc';
    this.style.fontWeight   = 'bold';
    document.getElementById(this.getAttribute('data-tab')).style.display = 'block';
  });
}


// --- LOCALSTORAGE HELPERS ---

function getPatients() {
  var data = localStorage.getItem('hims_admin_patients');
  return data ? JSON.parse(data) : [];
}
function savePatients(list) {
  localStorage.setItem('hims_admin_patients', JSON.stringify(list));
}

function getDoctors() {
  var data = localStorage.getItem('hims_admin_doctors');
  return data ? JSON.parse(data) : [];
}
function saveDoctors(list) {
  localStorage.setItem('hims_admin_doctors', JSON.stringify(list));
}

function getInvoices() {
  var data = localStorage.getItem('hims_admin_invoices');
  return data ? JSON.parse(data) : [];
}
function saveInvoices(list) {
  localStorage.setItem('hims_admin_invoices', JSON.stringify(list));
}


// --- OVERVIEW STATS ---

function updateStats() {
  var patientRows = document.getElementById('patients-tbody').querySelectorAll('tr');
  var doctorRows  = document.getElementById('doctors-tbody').querySelectorAll('tr');
  var invoiceRows = document.getElementById('invoices-tbody').querySelectorAll('tr');

  var totalRevenue = 0;
  for (var i = 0; i < invoiceRows.length; i++) {
    var cells  = invoiceRows[i].querySelectorAll('td');
    var status = cells[5] ? cells[5].textContent.trim() : '';
    var amount = cells[4] ? cells[4].textContent.replace('$', '') : '0';
    if (status === 'Paid') {
      totalRevenue += parseFloat(amount);
    }
  }

  document.getElementById('stat-patients').textContent = patientRows.length;
  document.getElementById('stat-doctors').textContent  = doctorRows.length;
  document.getElementById('stat-invoices').textContent = invoiceRows.length;
  document.getElementById('stat-revenue').textContent  = '$' + totalRevenue.toFixed(2);
}


// =============================================
// PATIENTS
// =============================================

var patientCounter = 4;

// Save hardcoded patients to localStorage on first load
function initHardcodedPatients() {
  var key = 'hims_patients_initialized';
  if (localStorage.getItem(key)) { return; }

  var hardcoded = [
    { id: 'P001', name: 'John Smith',   age: '45', gender: 'Male',   blood: 'O+', phone: '+1 800 555 0101', doctor: 'Dr. Lee'   },
    { id: 'P002', name: 'Mary Johnson', age: '32', gender: 'Female', blood: 'A+', phone: '+1 800 555 0202', doctor: 'Dr. Lee'   },
    { id: 'P003', name: 'Alan Brown',   age: '60', gender: 'Male',   blood: 'B-', phone: '+1 800 555 0303', doctor: 'Dr. Patel' }
  ];
  savePatients(hardcoded);
  localStorage.setItem(key, 'true');
}

function loadPatients() {
  initHardcodedPatients();
  var list  = getPatients();
  var tbody = document.getElementById('patients-tbody');
  tbody.innerHTML = ''; // Clear hardcoded HTML rows — render from localStorage

  for (var i = 0; i < list.length; i++) {
    addPatientRow(list[i]);
    var num = parseInt(list[i].id.replace('P00', ''));
    if (num >= patientCounter) { patientCounter = num + 1; }
  }
  updateStats();
}

function addPatientRow(p) {
  var tbody  = document.getElementById('patients-tbody');
  var newRow = document.createElement('tr');
  newRow.setAttribute('data-patient-id', p.id);
  newRow.innerHTML =
    '<td>' + p.id     + '</td>' +
    '<td>' + p.name   + '</td>' +
    '<td>' + p.age    + '</td>' +
    '<td>' + p.gender + '</td>' +
    '<td>' + p.blood  + '</td>' +
    '<td>' + p.phone  + '</td>' +
    '<td>' + p.doctor + '</td>' +
    '<td><button class="btn-delete">Delete</button></td>';
  tbody.appendChild(newRow);

  // Attach delete listener
  var deleteBtn = newRow.querySelector('.btn-delete');
  attachDeleteListener(deleteBtn, p.id, newRow);
}

// Attach delete for all rows (all patients now in localStorage)
function attachDeleteListener(btn, patientId, row) {
  btn.addEventListener('click', function() {
    if (!confirm('Delete patient ' + patientId + '? This cannot be undone.')) { return; }
    var tbody = document.getElementById('patients-tbody');
    tbody.removeChild(row);
    var list    = getPatients();
    var updated = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id !== patientId) { updated.push(list[i]); }
    }
    savePatients(updated);
    updateStats();
  });
}

var hardcodedPatientRows = document.getElementById('patients-tbody').querySelectorAll('tr');
for (var pr = 0; pr < hardcodedPatientRows.length; pr++) {
  var row       = hardcodedPatientRows[pr];
  var patientId = row.getAttribute('data-patient-id');
  var deleteBtn = row.querySelector('.btn-delete');
  attachDeleteListener(deleteBtn, patientId, row);
}

document.getElementById('show-patient-form-btn').addEventListener('click', function() {
  document.getElementById('patient-form').style.display          = 'block';
  document.getElementById('show-patient-form-btn').style.display = 'none';
});

document.getElementById('cancel-patient-btn').addEventListener('click', function() {
  document.getElementById('patient-form').style.display          = 'none';
  document.getElementById('show-patient-form-btn').style.display = 'inline-block';
  clearPatientForm();
});

document.getElementById('submit-patient-btn').addEventListener('click', function() {
  var name   = document.getElementById('p-name').value.trim();
  var age    = document.getElementById('p-age').value.trim();
  var gender = document.getElementById('p-gender').value;
  var blood  = document.getElementById('p-blood').value;
  var phone  = document.getElementById('p-phone').value.trim();
  var doctor = document.getElementById('p-doctor').value;

  if (name === '' || age === '' || gender === '' || blood === '' || phone === '' || doctor === '') {
    document.getElementById('patient-error').style.display = 'block';
    return;
  }
  document.getElementById('patient-error').style.display = 'none';

  var id = 'P00' + patientCounter;
  patientCounter++;

  var newPatient = { id: id, name: name, age: age, gender: gender, blood: blood, phone: phone, doctor: doctor };
  var list = getPatients();
  list.push(newPatient);
  savePatients(list);

  addPatientRow(newPatient);

  document.getElementById('patient-form').style.display          = 'none';
  document.getElementById('show-patient-form-btn').style.display = 'inline-block';
  clearPatientForm();
  updateStats();
});

function clearPatientForm() {
  document.getElementById('p-name').value   = '';
  document.getElementById('p-age').value    = '';
  document.getElementById('p-gender').value = '';
  document.getElementById('p-blood').value  = '';
  document.getElementById('p-phone').value  = '';
  document.getElementById('p-doctor').value = '';
  document.getElementById('patient-error').style.display = 'none';
}


// =============================================
// DOCTORS
// =============================================

var doctorCounter = 4;

// Save hardcoded doctors to localStorage on first load
function initHardcodedDoctors() {
  var key = 'hims_doctors_initialized';
  if (localStorage.getItem(key)) { return; }

  var hardcoded = [
    { id: 'D001', name: 'Dr. Sarah Lee',  specialty: 'General Physician', department: 'Internal Medicine', phone: '+1 800 555 0401' },
    { id: 'D002', name: 'Dr. Raj Patel',  specialty: 'Cardiologist',      department: 'Cardiology',        phone: '+1 800 555 0402' },
    { id: 'D003', name: 'Dr. Amir Khan',  specialty: 'Orthopaedist',      department: 'Orthopaedics',      phone: '+1 800 555 0403' }
  ];
  saveDoctors(hardcoded);
  localStorage.setItem(key, 'true');
}

function loadDoctors() {
  initHardcodedDoctors();
  var list  = getDoctors();
  var tbody = document.getElementById('doctors-tbody');
  tbody.innerHTML = ''; // Clear hardcoded HTML rows — render from localStorage

  for (var i = 0; i < list.length; i++) {
    addDoctorRow(list[i]);
    var num = parseInt(list[i].id.replace('D00', ''));
    if (num >= doctorCounter) { doctorCounter = num + 1; }
  }
  updateStats();
}

function addDoctorRow(d) {
  var tbody  = document.getElementById('doctors-tbody');
  var newRow = document.createElement('tr');
  newRow.innerHTML =
    '<td>' + d.id         + '</td>' +
    '<td>' + d.name       + '</td>' +
    '<td>' + d.specialty  + '</td>' +
    '<td>' + d.department + '</td>' +
    '<td>' + d.phone      + '</td>';
  tbody.appendChild(newRow);
}

document.getElementById('show-doctor-form-btn').addEventListener('click', function() {
  document.getElementById('doctor-form').style.display          = 'block';
  document.getElementById('show-doctor-form-btn').style.display = 'none';
});

document.getElementById('cancel-doctor-btn').addEventListener('click', function() {
  document.getElementById('doctor-form').style.display          = 'none';
  document.getElementById('show-doctor-form-btn').style.display = 'inline-block';
  clearDoctorForm();
});

document.getElementById('submit-doctor-btn').addEventListener('click', function() {
  var name       = document.getElementById('d-name').value.trim();
  var specialty  = document.getElementById('d-specialty').value.trim();
  var department = document.getElementById('d-department').value.trim();
  var phone      = document.getElementById('d-phone').value.trim();

  if (name === '' || specialty === '' || department === '' || phone === '') {
    document.getElementById('doctor-error').style.display = 'block';
    return;
  }
  document.getElementById('doctor-error').style.display = 'none';

  var id = 'D00' + doctorCounter;
  doctorCounter++;

  var newDoctor = { id: id, name: name, specialty: specialty, department: department, phone: phone };
  var list = getDoctors();
  list.push(newDoctor);
  saveDoctors(list);
  addDoctorRow(newDoctor);

  document.getElementById('doctor-form').style.display          = 'none';
  document.getElementById('show-doctor-form-btn').style.display = 'inline-block';
  clearDoctorForm();
  updateStats();
});

function clearDoctorForm() {
  document.getElementById('d-name').value       = '';
  document.getElementById('d-specialty').value  = '';
  document.getElementById('d-department').value = '';
  document.getElementById('d-phone').value      = '';
  document.getElementById('doctor-error').style.display = 'none';
}


// =============================================
// BILLING
// =============================================

var invoiceCounter = 104;

// Hardcoded invoices saved on first load if not already in localStorage
function initHardcodedInvoices() {
  var key = 'hims_invoices_initialized';
  if (localStorage.getItem(key)) { return; }

  var hardcoded = [
    { id: 'INV-101', patient: 'John Smith',   date: '20 Feb 2026', description: 'Consultation',    amount: '80.00',  status: 'Paid'   },
    { id: 'INV-102', patient: 'John Smith',   date: '18 Feb 2026', description: 'Lab Tests',       amount: '150.00', status: 'Unpaid' },
    { id: 'INV-103', patient: 'John Smith',   date: '10 Jan 2026', description: 'Routine Check-up',amount: '60.00',  status: 'Paid'   }
  ];
  saveInvoices(hardcoded);
  localStorage.setItem(key, 'true');
}

function loadInvoices() {
  initHardcodedInvoices();
  var list = getInvoices();
  var tbody = document.getElementById('invoices-tbody');
  tbody.innerHTML = ''; // Clear hardcoded HTML rows — we render from localStorage

  for (var i = 0; i < list.length; i++) {
    renderInvoiceRow(list[i]);
    var num = parseInt(list[i].id.replace('INV-', ''));
    if (num >= invoiceCounter) { invoiceCounter = num + 1; }
  }
  updateStats();
}

function renderInvoiceRow(inv) {
  var tbody       = document.getElementById('invoices-tbody');
  var statusClass = inv.status === 'Paid' ? 'status-paid' : 'status-unpaid';
  var btnLabel    = inv.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid';

  var newRow = document.createElement('tr');
  newRow.setAttribute('data-inv-id', inv.id);
  newRow.innerHTML =
    '<td>' + inv.id          + '</td>' +
    '<td>' + inv.patient     + '</td>' +
    '<td>' + inv.date        + '</td>' +
    '<td>' + inv.description + '</td>' +
    '<td>$' + parseFloat(inv.amount).toFixed(2) + '</td>' +
    '<td class="' + statusClass + '">' + inv.status + '</td>' +
    '<td><button class="btn-toggle-status" data-inv="' + inv.id + '" data-status="' + inv.status + '">' + btnLabel + '</button></td>';

  document.getElementById('invoices-tbody').appendChild(newRow);

  // Toggle status listener
  var btn = newRow.querySelector('.btn-toggle-status');
  btn.addEventListener('click', function() {
    var currentStatus = this.getAttribute('data-status');
    var newStatus     = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    var statusCell    = newRow.querySelector('td:nth-child(6)');

    statusCell.textContent = newStatus;
    statusCell.className   = newStatus === 'Paid' ? 'status-paid' : 'status-unpaid';
    this.textContent       = newStatus === 'Paid' ? 'Mark Unpaid' : 'Mark Paid';
    this.setAttribute('data-status', newStatus);

    // Update in localStorage
    var list = getInvoices();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === inv.id) {
        list[i].status = newStatus;
        break;
      }
    }
    saveInvoices(list);
    updateStats();
  });
}

document.getElementById('show-invoice-form-btn').addEventListener('click', function() {
  document.getElementById('invoice-form').style.display          = 'block';
  document.getElementById('show-invoice-form-btn').style.display = 'none';
});

document.getElementById('cancel-invoice-btn').addEventListener('click', function() {
  document.getElementById('invoice-form').style.display          = 'none';
  document.getElementById('show-invoice-form-btn').style.display = 'inline-block';
  clearInvoiceForm();
});

document.getElementById('submit-invoice-btn').addEventListener('click', function() {
  var patient     = document.getElementById('inv-patient').value;
  var date        = document.getElementById('inv-date').value;
  var description = document.getElementById('inv-description').value.trim();
  var amount      = document.getElementById('inv-amount').value.trim();

  if (patient === '' || date === '' || description === '' || amount === '') {
    document.getElementById('invoice-error').style.display = 'block';
    return;
  }
  document.getElementById('invoice-error').style.display = 'none';

  var id = 'INV-' + invoiceCounter;
  invoiceCounter++;

  var newInvoice = { id: id, patient: patient, date: date, description: description, amount: amount, status: 'Unpaid' };
  var list = getInvoices();
  list.push(newInvoice);
  saveInvoices(list);
  renderInvoiceRow(newInvoice);

  document.getElementById('invoice-form').style.display          = 'none';
  document.getElementById('show-invoice-form-btn').style.display = 'inline-block';
  clearInvoiceForm();
  updateStats();
});

function clearInvoiceForm() {
  document.getElementById('inv-patient').value     = '';
  document.getElementById('inv-date').value        = '';
  document.getElementById('inv-description').value = '';
  document.getElementById('inv-amount').value      = '';
  document.getElementById('invoice-error').style.display = 'none';
}


// --- INIT ---
loadPatients();
loadDoctors();
loadInvoices();
updateStats();
