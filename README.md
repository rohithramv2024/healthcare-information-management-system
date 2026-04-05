# Healthcare Information Management System (HIMS)

The Healthcare Information Management System (HIMS) is a web-based application designed to efficiently store, manage, and retrieve patient healthcare information. Built as a front-end project using HTML5, CSS3, and Vanilla JavaScript, HIMS provides a clean role-based interface that brings structure and accessibility to everyday healthcare workflows.

This system helps streamline:
- Patient records management
- Appointment scheduling
- Medical history tracking
- Healthcare data organisation

The goal of this project is to improve accessibility, reduce paperwork, and enhance the overall efficiency of healthcare data management — giving patients, doctors, and administrators a dedicated space to view and manage the information relevant to them.

---

## Authors

- Rohith Ram V
- Vaishakh Manoj Nair

---

## Project Structure

    HIMS/
      images/                    - Image assets
      index.html                 - Landing page
      role.html                  - Role selection page
      patient.html               - Patient module
      doctor.html                - Doctor module
      admin.html                 - Admin module
      style.css                  - Landing page styles
      dashboard.css              - Role selection page styles
      patient.css                - Patient module styles
      doctor.css                 - Doctor module styles
      admin.css                  - Admin module styles
      main.js                    - Landing page JS (form validation)
      role.js                    - Role selection JS (sessionStorage)
      dashboard.js               - Shared navbar JS
      patient.js                 - Patient module JS
      doctor.js                  - Doctor module JS
      admin.js                   - Admin module JS
      reset.js                   - Shared data reset JS
      HIMS-Development Log.docx  - Version history and development log
      README.md

---

## Dependencies

None. This project uses only:
- HTML5
- CSS3
- Vanilla JavaScript

No npm packages, no frameworks, no backend, and no installation required.

---

## How to Run

1. Clone or download the repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
3. Click **Get Started** to enter the application
4. Select a role to access the corresponding module

> All files must be kept in the same folder for CSS and JS links to work correctly.

---

## Role Access

| Role    | Access |
|---------|--------|
| Patient | Personal info, assigned doctor, appointments, medical records, billing |
| Doctor  | Overview, patient list, upcoming appointments, patient details, prescription and diagnosis |
| Admin   | Overview, manage patients, manage doctors, billing |

---

## Features

**Patient Module**
- View personal information and assigned doctor details
- View upcoming and past appointments
- Book new appointments with complaints and symptoms
- Cancel upcoming appointments
- View medical records — diagnosis history, prescriptions, and lab results
- View billing and payment status

**Doctor Module**
- Overview stats — total patients, appointments, and pending consultations
- View list of assigned patients with clickable rows for full details
- Mark appointments as completed
- Add diagnosis notes and prescriptions per patient
- Patient appointments booked through the Patient module reflect here
- Patient selection via table row click or dropdown

**Admin Module**
- Overview stats — total patients, doctors, invoices, and revenue
- Add and delete patients
- Add doctors
- Add invoices and toggle paid/unpaid status
- All billing changes reflect in the Patient module

---

## Data Persistence

This project uses the browser's **localStorage** to persist data with no backend or database required.

| Key | Description |
|-----|-------------|
| `hims_admin_patients` | All patient records |
| `hims_admin_doctors` | All doctor records |
| `hims_admin_invoices` | All billing invoices |
| `hims_appointments` | Patient booked appointments |
| `hims_appt_statuses` | Doctor appointment completion statuses |
| `hims_diagnoses_[id]` | Diagnosis records per patient |
| `hims_prescriptions_[id]` | Prescription records per patient |

> Data persists until manually cleared or reset via the Reset Data button in each module's navbar.

---

## Resetting Data

Each module page has a **Reset Data** button in the top navbar. Clicking it restores all data to the original preset state after a confirmation prompt.

---

## Browser Compatibility

Tested and confirmed on:
- Google Chrome
- Opera / Opera GX

Other browsers may work but have not been tested.

---

## Notes

- This is a front-end only project. Data is stored in the browser and is device-specific.
- sessionStorage is used to pass the selected role between pages.
- A small set of JavaScript features used outside the course syllabus (sessionStorage, localStorage, trim(), includes()) are documented in the extra topics reference file included in the repository.

---

## Development Log

See `HIMS-Development Log.docx` for the full version-based milestone summary.

| Version | Description |
|---------|-------------|
| 1.0.0 | Static landing page |
| 1.1.0 | Role-based layout |
| 1.2.0 | Patient module UI |
| 1.3.0 | JavaScript and DOM integration |
| 1.4.0 | Patient module functionality |
| 1.5.0 | Doctor module |
| 1.6.0 | Admin module |
