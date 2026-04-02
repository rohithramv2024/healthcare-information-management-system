// =============================================
// reset.js — Reset localStorage to initial state
// Shared across admin, doctor, and patient pages
// =============================================

function resetToInitialState() {
  if (!confirm('This will reset all data to the original state. All changes will be lost. Continue?')) {
    return;
  }

  // --- Clear all HIMS keys from localStorage ---
  var keysToRemove = [];
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key && key.indexOf('hims_') === 0) {
      keysToRemove.push(key);
    }
  }
  for (var j = 0; j < keysToRemove.length; j++) {
    localStorage.removeItem(keysToRemove[j]);
  }

  // --- Re-initialize patients ---
  var defaultPatients = [
    { id: 'P001', name: 'John Smith',   age: '45', gender: 'Male',   blood: 'O+', phone: '+1 800 555 0101', doctor: 'Dr. Lee'   },
    { id: 'P002', name: 'Mary Johnson', age: '32', gender: 'Female', blood: 'A+', phone: '+1 800 555 0202', doctor: 'Dr. Lee'   },
    { id: 'P003', name: 'Alan Brown',   age: '60', gender: 'Male',   blood: 'B-', phone: '+1 800 555 0303', doctor: 'Dr. Patel' }
  ];
  localStorage.setItem('hims_admin_patients',      JSON.stringify(defaultPatients));
  localStorage.setItem('hims_patients_initialized', 'true');

  // --- Re-initialize doctors ---
  var defaultDoctors = [
    { id: 'D001', name: 'Dr. Sarah Lee',  specialty: 'General Physician', department: 'Internal Medicine', phone: '+1 800 555 0401' },
    { id: 'D002', name: 'Dr. Raj Patel',  specialty: 'Cardiologist',      department: 'Cardiology',        phone: '+1 800 555 0402' },
    { id: 'D003', name: 'Dr. Amir Khan',  specialty: 'Orthopaedist',      department: 'Orthopaedics',      phone: '+1 800 555 0403' }
  ];
  localStorage.setItem('hims_admin_doctors', JSON.stringify(defaultDoctors));
  localStorage.setItem('hims_doctors_initialized', 'true');

  // --- Re-initialize invoices ---
  var defaultInvoices = [
    { id: 'INV-101', patient: 'John Smith', date: '20 Feb 2026', description: 'Consultation',     amount: '80.00',  status: 'Paid'   },
    { id: 'INV-102', patient: 'John Smith', date: '18 Feb 2026', description: 'Lab Tests',        amount: '150.00', status: 'Unpaid' },
    { id: 'INV-103', patient: 'John Smith', date: '10 Jan 2026', description: 'Routine Check-up', amount: '60.00',  status: 'Paid'   }
  ];
  localStorage.setItem('hims_admin_invoices',      JSON.stringify(defaultInvoices));
  localStorage.setItem('hims_invoices_initialized', 'true');

  // --- Re-initialize appointments ---
  localStorage.setItem('hims_appointments',      JSON.stringify([]));
  localStorage.setItem('hims_appt_statuses',     JSON.stringify([]));

  // --- Clear diagnoses and prescriptions ---
  localStorage.removeItem('hims_diagnoses_P001');
  localStorage.removeItem('hims_diagnoses_P002');
  localStorage.removeItem('hims_diagnoses_P003');
  localStorage.removeItem('hims_prescriptions_P001');
  localStorage.removeItem('hims_prescriptions_P002');
  localStorage.removeItem('hims_prescriptions_P003');

  alert('Data has been reset to the initial state. The page will now reload.');
  window.location.reload();
}

// Attach listener to reset button if it exists on this page
var resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
  resetBtn.addEventListener('click', resetToInitialState);
}
