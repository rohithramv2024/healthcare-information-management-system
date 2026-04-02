Healthcare Information Management System (HIMS)
The Healthcare Information Management System (HIMS) is a web-based application designed to efficiently store, manage, and retrieve patient healthcare information. Built as a front-end project using HTML5, CSS3, and Vanilla JavaScript, HIMS provides a clean role-based interface that brings structure and accessibility to everyday healthcare workflows.
This system helps streamline:

Patient records management
Appointment scheduling
Medical history tracking
Healthcare data organisation

The goal of this project is to improve accessibility, reduce paperwork, and enhance the overall efficiency of healthcare data management — giving patients, doctors, and administrators a dedicated space to view and manage the information relevant to them.

Authors

Rohith Ram V

Vaishakh Manoj Nair

Project Structure
HIMS/
├── images/                     # Image assets
├── index.html                  # Landing page
├── role.html                   # Role selection page
├── patient.html                # Patient module
├── doctor.html                 # Doctor module
├── admin.html                  # Admin module
├── style.css                   # Landing page styles
├── dashboard.css               # Role selection page styles
├── patient.css                 # Patient module styles
├── doctor.css                  # Doctor module styles
├── admin.css                   # Admin module styles
├── main.js                     # Landing page JS (form validation)
├── role.js                     # Role selection JS (sessionStorage)
├── dashboard.js                # Shared navbar JS
├── patient.js                  # Patient module JS
├── doctor.js                   # Doctor module JS
├── admin.js                    # Admin module JS
├── reset.js                    # Shared data reset JS
├── HIMS-Development Log.docx   # Version history and development log
└── README.md

Dependencies:
None. This project uses only:

HTML5
CSS3
Vanilla JavaScript

No npm packages, no frameworks, no backend, and no installation required.

How to Run:

Clone or download the repository
Open index.html in any modern browser (Chrome, Firefox, Edge)
Click Get Started to enter the application
Select a role to access the corresponding module

Note:
1.All files must be kept in the same folder for CSS and JS links to work correctly.
2.This is a front-end only project. Data is stored in the browser and is device-specific.
3.sessionStorage is used to pass the selected role between pages.

Development Log
See HIMS-Development Log.docx for the full version-based milestone summary.
