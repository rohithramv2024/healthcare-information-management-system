// =============================================
// doctor.js — Doctor module
// =============================================


// --- READ PATIENT DATA FROM LOCALSTORAGE ---

function getPatientData() {
  var data = localStorage.getItem('hims_admin_patients');
  if (data) { return JSON.parse(data); }
  return [
    { id: 'P001', name: 'John Smith',   age: 45, gender: 'Male',   dob: '12 March 1980',   phone: '+1 800 555 0101', email: 'john.smith@email.com', blood: 'O+', address: '12 Elm Street, San Francisco, CA' },
    { id: 'P002', name: 'Mary Johnson', age: 32, gender: 'Female', dob: '05 July 1993',     phone: '+1 800 555 0202', email: 'mary.j@email.com',      blood: 'A+', address: '45 Oak Avenue, Los Angeles, CA'   },
    { id: 'P003', name: 'Alan Brown',   age: 60, gender: 'Male',   dob: '18 November 1965', phone: '+1 800 555 0303', email: 'alan.b@email.com',       blood: 'B-', address: '78 Pine Road, San Diego, CA'      }
  ];
}

function getPatientById(id) {
  var patients = getPatientData();
  for (var i = 0; i < patients.length; i++) {
    if (patients[i].id === id) { return patients[i]; }
  }
  return null;
}


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


// --- BUILD PATIENT TABLE AND DROPDOWNS ---

var selectedPatientId = null;

function buildPatientList() {
  var patients  = getPatientData();
  var tbody     = document.getElementById('patients-tbody');
  var detailsDd = document.getElementById('details-dropdown');
  var prescDd   = document.getElementById('prescription-dropdown');

  tbody.innerHTML     = '';
  detailsDd.innerHTML = '<option value="">-- Select a patient --</option>';
  prescDd.innerHTML   = '<option value="">-- Select a patient --</option>';

  for (var i = 0; i < patients.length; i++) {
    var p = patients[i];

    var row = document.createElement('tr');
    row.className = 'clickable-row';
    row.setAttribute('data-patient', p.id);
    row.innerHTML =
      '<td>' + p.id     + '</td>' +
      '<td>' + p.name   + '</td>' +
      '<td>' + p.age    + '</td>' +
      '<td>' + p.gender + '</td>' +
      '<td>' + p.blood  + '</td>' +
      '<td>' + p.phone  + '</td>';
    tbody.appendChild(row);

    var opt1 = document.createElement('option');
    opt1.value = p.id; opt1.textContent = p.id + ' - ' + p.name;
    detailsDd.appendChild(opt1);

    var opt2 = document.createElement('option');
    opt2.value = p.id; opt2.textContent = p.id + ' - ' + p.name;
    prescDd.appendChild(opt2);
  }

  attachRowListeners();
}


// --- ATTACH ROW CLICK LISTENERS ---

function attachRowListeners() {
  var patientRows = document.querySelectorAll('.clickable-row');
  for (var r = 0; r < patientRows.length; r++) {
    patientRows[r].addEventListener('click', function() {
      var rows = document.querySelectorAll('.clickable-row');
      for (var x = 0; x < rows.length; x++) {
        rows[x].style.backgroundColor = '';
      }
      this.style.backgroundColor = '#e8f0fe';

      selectedPatientId = this.getAttribute('data-patient');
      document.getElementById('details-dropdown').value      = selectedPatientId;
      document.getElementById('prescription-dropdown').value = selectedPatientId;
      loadPatientDetails(selectedPatientId);
      loadPrescriptionTab(selectedPatientId);
    });
  }
}


// --- OVERVIEW STATS ---

function updateStats() {
  var patients = getPatientData();
  document.getElementById('stat-total-patients').textContent = patients.length;

  var apptRows     = document.querySelectorAll('#appt-tbody tr');
  var pendingCount = 0;
  for (var i = 0; i < apptRows.length; i++) {
    var cells = apptRows[i].querySelectorAll('td');
    if (cells[5] && cells[5].textContent === 'Pending') { pendingCount++; }
  }
  document.getElementById('stat-today-appointments').textContent = apptRows.length;
  document.getElementById('stat-pending').textContent            = pendingCount;
}


// --- PATIENT DETAILS DROPDOWN ---

document.getElementById('details-dropdown').addEventListener('change', function() {
  var id = this.value;
  if (id === '') { return; }
  selectedPatientId = id;
  document.getElementById('prescription-dropdown').value = id;
  loadPatientDetails(id);
  loadPrescriptionTab(id);
});


// --- PRESCRIPTION DROPDOWN ---

document.getElementById('prescription-dropdown').addEventListener('change', function() {
  var id = this.value;
  if (id === '') { return; }
  selectedPatientId = id;
  document.getElementById('details-dropdown').value = id;
  loadPrescriptionTab(id);
  loadPatientDetails(id);
});


// --- LOAD PATIENT DETAILS ---

function loadPatientDetails(id) {
  var patient = getPatientById(id);
  if (!patient) { return; }

  document.getElementById('details-hint').style.display    = 'none';
  document.getElementById('details-content').style.display = 'block';
  document.getElementById('details-name').textContent      = patient.name;

  var infoCard = document.getElementById('details-info');
  infoCard.innerHTML =
    '<div class="info-row"><span class="info-label">Patient ID</span><span class="info-value">'  + patient.id      + '</span></div>' +
    '<div class="info-row"><span class="info-label">Age</span><span class="info-value">'          + patient.age     + '</span></div>' +
    '<div class="info-row"><span class="info-label">Gender</span><span class="info-value">'       + patient.gender  + '</span></div>' +
    '<div class="info-row"><span class="info-label">Phone</span><span class="info-value">'         + patient.phone   + '</span></div>' +
    '<div class="info-row"><span class="info-label">Blood Group</span><span class="info-value">'  + patient.blood   + '</span></div>';

  // Diagnoses
  var diagBody = document.getElementById('details-diagnoses');
  diagBody.innerHTML = '';
  var diagnoses = getDiagnoses(id);
  if (diagnoses.length === 0) {
    diagBody.innerHTML = '<tr><td colspan="3">No records found.</td></tr>';
  } else {
    for (var i = 0; i < diagnoses.length; i++) {
      var d = diagnoses[i];
      var row = document.createElement('tr');
      row.innerHTML = '<td>' + d.date + '</td><td>' + d.diagnosis + '</td><td>' + d.notes + '</td>';
      diagBody.appendChild(row);
    }
  }

  // Prescriptions
  var prescBody = document.getElementById('details-prescriptions');
  prescBody.innerHTML = '';
  var prescriptions = getPrescriptions(id);
  if (prescriptions.length === 0) {
    prescBody.innerHTML = '<tr><td colspan="4">No records found.</td></tr>';
  } else {
    for (var j = 0; j < prescriptions.length; j++) {
      var p = prescriptions[j];
      var prow = document.createElement('tr');
      prow.innerHTML = '<td>' + p.date + '</td><td>' + p.medicine + '</td><td>' + p.dosage + '</td><td>' + p.duration + '</td>';
      prescBody.appendChild(prow);
    }
  }
}


// --- GO TO PRESCRIPTION TAB ---

document.getElementById('go-to-prescription').addEventListener('click', function() {
  for (var i = 0; i < tabBtns.length; i++) {
    if (tabBtns[i].getAttribute('data-tab') === 'prescription') {
      tabBtns[i].click();
      break;
    }
  }
});


// --- LOAD PRESCRIPTION TAB ---

function loadPrescriptionTab(id) {
  var patient = getPatientById(id);
  if (!patient) { return; }
  document.getElementById('prescription-hint').style.display    = 'none';
  document.getElementById('prescription-content').style.display = 'block';
  document.getElementById('prescription-patient-name').textContent = 'Patient: ' + patient.name;
}


// --- MARK APPOINTMENT COMPLETE ---

function getSavedStatuses() {
  var data = localStorage.getItem('hims_appt_statuses');
  return data ? JSON.parse(data) : [];
}

function saveStatus(rowIndex) {
  var statuses = getSavedStatuses();
  if (statuses.indexOf(rowIndex) === -1) {
    statuses.push(rowIndex);
    localStorage.setItem('hims_appt_statuses', JSON.stringify(statuses));
  }
}

function loadAppointmentStatuses() {
  var statuses = getSavedStatuses();
  for (var i = 0; i < statuses.length; i++) {
    var rowIndex   = statuses[i];
    var statusCell = document.getElementById('status-' + rowIndex);
    var btn        = document.querySelector('.btn-status[data-row="' + rowIndex + '"]');
    if (statusCell) {
      statusCell.textContent      = 'Completed';
      statusCell.style.color      = '#198754';
      statusCell.style.fontWeight = 'bold';
    }
    if (btn) { btn.style.display = 'none'; }
  }
  updateStats();
}

var statusBtns = document.querySelectorAll('.btn-status');
for (var s = 0; s < statusBtns.length; s++) {
  statusBtns[s].addEventListener('click', function() {
    var rowIndex   = this.getAttribute('data-row');
    var statusCell = document.getElementById('status-' + rowIndex);
    statusCell.textContent      = 'Completed';
    statusCell.style.color      = '#198754';
    statusCell.style.fontWeight = 'bold';
    this.style.display = 'none';
    saveStatus(rowIndex);
    updateStats();
  });
}


// --- LOCALSTORAGE HELPERS ---

function getDiagnoses(patientId) {
  var data = localStorage.getItem('hims_diagnoses_' + patientId);
  return data ? JSON.parse(data) : [];
}
function saveDiagnoses(patientId, list) {
  localStorage.setItem('hims_diagnoses_' + patientId, JSON.stringify(list));
}
function getPrescriptions(patientId) {
  var data = localStorage.getItem('hims_prescriptions_' + patientId);
  return data ? JSON.parse(data) : [];
}
function savePrescriptions(patientId, list) {
  localStorage.setItem('hims_prescriptions_' + patientId, JSON.stringify(list));
}


// --- SAVE DIAGNOSIS ---

document.getElementById('submit-diag-btn').addEventListener('click', function() {
  if (!selectedPatientId) { return; }
  var date      = document.getElementById('diag-date').value;
  var diagnosis = document.getElementById('diag-text').value.trim();
  var notes     = document.getElementById('diag-notes').value.trim();

  if (date === '' || diagnosis === '' || notes === '') {
    document.getElementById('diag-error').style.display = 'block';
    return;
  }
  document.getElementById('diag-error').style.display = 'none';

  var list = getDiagnoses(selectedPatientId);
  list.push({ date: date, diagnosis: diagnosis, notes: notes });
  saveDiagnoses(selectedPatientId, list);

  document.getElementById('diag-success').style.display = 'block';
  document.getElementById('diag-date').value  = '';
  document.getElementById('diag-text').value  = '';
  document.getElementById('diag-notes').value = '';
  setTimeout(function() { document.getElementById('diag-success').style.display = 'none'; }, 2000);
});


// --- SAVE PRESCRIPTION ---

document.getElementById('submit-presc-btn').addEventListener('click', function() {
  if (!selectedPatientId) { return; }
  var date     = document.getElementById('presc-date').value;
  var medicine = document.getElementById('presc-medicine').value.trim();
  var dosage   = document.getElementById('presc-dosage').value.trim();
  var duration = document.getElementById('presc-duration').value.trim();

  if (date === '' || medicine === '' || dosage === '' || duration === '') {
    document.getElementById('presc-error').style.display = 'block';
    return;
  }
  document.getElementById('presc-error').style.display = 'none';

  var list = getPrescriptions(selectedPatientId);
  list.push({ date: date, medicine: medicine, dosage: dosage, duration: duration });
  savePrescriptions(selectedPatientId, list);

  document.getElementById('presc-success').style.display = 'block';
  document.getElementById('presc-date').value     = '';
  document.getElementById('presc-medicine').value = '';
  document.getElementById('presc-dosage').value   = '';
  document.getElementById('presc-duration').value = '';
  setTimeout(function() { document.getElementById('presc-success').style.display = 'none'; }, 2000);
});


// --- LOAD PATIENT BOOKED APPOINTMENTS INTO DOCTOR TAB ---
// Reads from hims_appointments (saved by patient module)
// and adds rows for appointments booked with Dr. Lee

function loadPatientAppointments() {
  var data = localStorage.getItem('hims_appointments');
  if (!data) { return; }

  var appointments = JSON.parse(data);
  var tbody        = document.getElementById('appt-tbody');
  var rowIndex     = tbody.querySelectorAll('tr').length; // continue index after hardcoded rows

  for (var i = 0; i < appointments.length; i++) {
    var appt = appointments[i];
    if (appt.doctor !== 'Dr. Lee') { continue; }

    var newRow = document.createElement('tr');
    newRow.innerHTML =
      '<td>' + appt.date     + '</td>' +
      '<td>' + appt.time     + '</td>' +
      '<td>John Smith</td>'            +
      '<td>' + appt.reason   + '</td>' +
      '<td>' + appt.symptoms + '</td>' +
      '<td id="status-' + rowIndex + '">Pending</td>' +
      '<td><button class="btn-status" data-row="' + rowIndex + '">Mark Complete</button></td>';
    tbody.appendChild(newRow);

    // Attach mark complete listener
    var btn = newRow.querySelector('.btn-status');
    btn.addEventListener('click', function() {
      var idx        = this.getAttribute('data-row');
      var statusCell = document.getElementById('status-' + idx);
      statusCell.textContent      = 'Completed';
      statusCell.style.color      = '#198754';
      statusCell.style.fontWeight = 'bold';
      this.style.display = 'none';
      saveStatus(idx);
      updateStats();
    });

    rowIndex++;
  }
  updateStats();
}


// --- INIT ---
buildPatientList();
updateStats();
loadAppointmentStatuses();
loadPatientAppointments();
