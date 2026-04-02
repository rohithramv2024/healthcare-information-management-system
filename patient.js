// =============================================
// patient.js — Patient module
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

    var target = this.getAttribute('data-tab');
    document.getElementById(target).style.display = 'block';

  });
}


// --- LOCALSTORAGE HELPERS ---

function getSavedAppointments() {
  var data = localStorage.getItem('hims_appointments');
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

function saveAppointments(appointments) {
  localStorage.setItem('hims_appointments', JSON.stringify(appointments));
}


// --- TBODY REFERENCE ---

var tbody = document.getElementById('upcoming-tbody');


// --- CANCEL FOR HARDCODED ROWS (not in localStorage, just remove from DOM) ---

var hardcodedRows = tbody.querySelectorAll('tr');

for (var h = 0; h < hardcodedRows.length; h++) {
  var cancelBtn = hardcodedRows[h].querySelector('.btn-cancel');
  cancelBtn.addEventListener('click', function() {
    var row = this.parentNode.parentNode;
    tbody.removeChild(row);
  });
}


// --- LOAD SAVED APPOINTMENTS FROM LOCALSTORAGE ---

function loadAppointments() {
  var appointments = getSavedAppointments();
  for (var i = 0; i < appointments.length; i++) {
    addRowToTable(appointments[i], i);
  }
}

// Add a single row to the table with a cancel button
function addRowToTable(appt, index) {
  var newRow = document.createElement('tr');
  newRow.setAttribute('data-index', index);

  newRow.innerHTML =
    '<td>' + appt.date     + '</td>' +
    '<td>' + appt.time     + '</td>' +
    '<td>' + appt.doctor   + '</td>' +
    '<td>' + appt.reason   + '</td>' +
    '<td>' + appt.symptoms + '</td>' +
    '<td>Pending</td>'               +
    '<td><button class="btn-cancel">Cancel</button></td>';

  tbody.appendChild(newRow);

  // Cancel — removes from localStorage and from DOM
  var cancelBtn = newRow.querySelector('.btn-cancel');
  cancelBtn.addEventListener('click', function() {
    var idx          = parseInt(newRow.getAttribute('data-index'));
    var appointments = getSavedAppointments();
    appointments.splice(idx, 1);
    saveAppointments(appointments);
    tbody.removeChild(newRow);
    reindexRows();
  });
}

// After a cancel, update data-index on remaining saved rows
function reindexRows() {
  var rows = tbody.querySelectorAll('tr[data-index]');
  for (var i = 0; i < rows.length; i++) {
    rows[i].setAttribute('data-index', i);
  }
}

loadAppointments();


// --- SHOW / HIDE BOOKING FORM ---

var showFormBtn   = document.getElementById('show-form-btn');
var bookingForm   = document.getElementById('booking-form');
var cancelFormBtn = document.getElementById('cancel-form-btn');

showFormBtn.addEventListener('click', function() {
  bookingForm.style.display = 'block';
  showFormBtn.style.display = 'none';
});

cancelFormBtn.addEventListener('click', function() {
  bookingForm.style.display = 'none';
  showFormBtn.style.display = 'inline-block';
  clearForm();
});


// --- BOOK APPOINTMENT ---

var submitBtn = document.getElementById('submit-appt-btn');
var apptError = document.getElementById('appt-error');

submitBtn.addEventListener('click', function() {

  var date     = document.getElementById('appt-date').value;
  var time     = document.getElementById('appt-time').value;
  var doctor   = document.getElementById('appt-doctor').value;
  var reason   = document.getElementById('appt-reason').value.trim();
  var symptoms = document.getElementById('appt-symptoms').value.trim();

  if (date === '' || time === '' || doctor === '' || reason === '' || symptoms === '') {
    apptError.style.display = 'block';
    return;
  }

  apptError.style.display = 'none';

  var newAppt = {
    date:     date,
    time:     formatTime(time),
    doctor:   doctor,
    reason:   reason,
    symptoms: symptoms
  };

  // Save to localStorage
  var appointments = getSavedAppointments();
  appointments.push(newAppt);
  saveAppointments(appointments);

  // Add row to table
  addRowToTable(newAppt, appointments.length - 1);

  // Reset form
  bookingForm.style.display = 'none';
  showFormBtn.style.display = 'inline-block';
  clearForm();
});


// --- HELPERS ---

function clearForm() {
  document.getElementById('appt-date').value     = '';
  document.getElementById('appt-time').value     = '';
  document.getElementById('appt-doctor').value   = '';
  document.getElementById('appt-reason').value   = '';
  document.getElementById('appt-symptoms').value = '';
  apptError.style.display = 'none';
}

function formatTime(time) {
  var parts  = time.split(':');
  var hours  = parseInt(parts[0]);
  var mins   = parts[1];
  var period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) { hours = 12; }
  return hours + ':' + mins + ' ' + period;
}


// --- LOAD DOCTOR'S DIAGNOSES & PRESCRIPTIONS INTO MEDICAL RECORDS ---
// Patient ID for John Smith (the hardcoded patient) is P001
// When the Medical Records tab is opened, we read from localStorage
// and inject any entries the doctor has added

var PATIENT_ID = 'P001';

function loadMedicalRecords() {

  // Load diagnoses
  var diagBody = document.getElementById('diag-history-tbody');
  if (diagBody) {
    var data = localStorage.getItem('hims_diagnoses_' + PATIENT_ID);
    var diagnoses = data ? JSON.parse(data) : [];
    for (var i = 0; i < diagnoses.length; i++) {
      var d   = diagnoses[i];
      var row = document.createElement('tr');
      row.innerHTML = '<td>' + d.date + '</td><td>' + d.diagnosis + '</td><td>Dr. Lee</td><td>' + d.notes + '</td>';
      diagBody.appendChild(row);
    }
  }

  // Load prescriptions
  var prescBody = document.getElementById('presc-tbody');
  if (prescBody) {
    var pdata = localStorage.getItem('hims_prescriptions_' + PATIENT_ID);
    var prescriptions = pdata ? JSON.parse(pdata) : [];
    for (var j = 0; j < prescriptions.length; j++) {
      var p    = prescriptions[j];
      var prow = document.createElement('tr');
      prow.innerHTML = '<td>' + p.date + '</td><td>' + p.medicine + '</td><td>' + p.dosage + '</td><td>' + p.duration + '</td><td>Dr. Lee</td>';
      prescBody.appendChild(prow);
    }
  }
}

loadMedicalRecords();


// --- LOAD BILLING FROM LOCALSTORAGE ---
// Reads invoices saved by admin and renders them in the billing tab
// Only shows invoices for John Smith (P001)

function loadBilling() {
  var billingTbody = document.getElementById('billing-tbody');
  if (!billingTbody) { return; }

  var data = localStorage.getItem('hims_admin_invoices');
  if (!data) { return; }

  var invoices = JSON.parse(data);

  // Clear existing rows first to avoid duplicates
  billingTbody.innerHTML = '';

  for (var i = 0; i < invoices.length; i++) {
    var inv = invoices[i];
    if (inv.patient !== 'John Smith') { continue; }

    var row = document.createElement('tr');
    var statusClass = inv.status === 'Paid' ? 'status-paid' : 'status-unpaid';
    row.innerHTML =
      '<td>' + inv.id          + '</td>' +
      '<td>' + inv.date        + '</td>' +
      '<td>' + inv.description + '</td>' +
      '<td>$' + parseFloat(inv.amount).toFixed(2) + '</td>' +
      '<td class="' + statusClass + '">' + inv.status + '</td>';
    billingTbody.appendChild(row);
  }
}

loadBilling();
