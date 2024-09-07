// script.js

const CLIENT_ID = '240137685388-589vp1i9to97jvab8tpl5f45h8tmir9n.apps.googleusercontent.com'; // Replace with your actual Client ID
const API_KEY = 'AIzaSyCG3kzTHUu0athe8QjBNlpDmrTtU15Kt4w'; // Replace with your actual API Key
const SHEET_ID = '1srXMPdegn0geEframJ6yN9jyJWT5-78SiYAIvj8TvGs'; // Replace with your Google Sheet ID
const RANGE = 'EmpDB!A:V'; // Adjust the range based on the number of columns in your Google Sheet

let employeeCount = localStorage.getItem('employeeCount') ? parseInt(localStorage.getItem('employeeCount')) : 1;
let employees = JSON.parse(localStorage.getItem('employees')) || [];

// Helper function to format employee registration number
function getEmployeeRegNo(count) {
    return `Emp${count.toString().padStart(3, '0')}`;
}

// Function to validate required fields
function validateForm() {
    const fields = [
        'firstName', 'lastName', 'nationalID', 'jobTitle', 'department', 'region',
        'mobileNumber', 'privateEmail', 'dob', 'salary', 'employeeType',
        'contractStartDate', 'contractEndDate', 'nextOfKinName', 'nextOfKinMobile', 'nextOfKinLocation'
    ];

    for (const field of fields) {
        if (!document.getElementById(field).value.trim()) {
            alert('Please fill in all required fields.');
            return false;
        }
    }

    return true;
}

// Initialize Google API client
function initClient() {
    gapi.load('client:auth2', function () {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        }).then(function () {
            gapi.auth2.getAuthInstance().signIn();
        });
    });
}

// Function to update the Google Sheet
function updateSheet(employee) {
    const values = [
        [employee.regNo, employee.firstName, employee.middleName, employee.lastName, employee.nationalID,
        employee.mobileNumber, employee.privateEmail, employee.workEmail, employee.dob, employee.jobTitle,
        employee.department, employee.region, employee.salary, employee.employeeType, employee.contractStartDate,
        employee.contractEndDate, employee.contractPeriod, employee.nextOfKinName, employee.nextOfKinMobile,
        employee.nextOfKinEmail, employee.nextOfKinLocation]
    ];

    const body = {
        values: values
    };

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: body
    }).then((response) => {
        console.log('Data saved to Google Sheets:', response);
    }).catch((error) => {
        console.error('Error saving data to Google Sheets:', error);
    });
}

// Event listener for save button
document.getElementById('saveBtn').addEventListener('click', function () {
    if (!validateForm()) return;

    const nationalID = document.getElementById('nationalID').value.trim();

    // Check if employee with the same national ID already exists
    if (employees.some(emp => emp.nationalID === nationalID)) {
        alert('Employee with this National ID already exists.');
        return;
    }

    const employee = {
        regNo: getEmployeeRegNo(employeeCount),
        firstName: document.getElementById('firstName').value.trim(),
        middleName: document.getElementById('middleName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        nationalID: document.getElementById('nationalID').value.trim(),
        mobileNumber: document.getElementById('mobileNumber').value.trim(),
        privateEmail: document.getElementById('privateEmail').value.trim(),
        workEmail: document.getElementById('workEmail').value.trim(),
        dob: document.getElementById('dob').value.trim(),
        jobTitle: document.getElementById('jobTitle').value,
        department: document.getElementById('department').value,
        region: document.getElementById('region').value,
        salary: document.getElementById('salary').value.trim(),
        employeeType: document.getElementById('employeeType').value,
        contractStartDate: document.getElementById('contractStartDate').value.trim(),
        contractEndDate: document.getElementById('contractEndDate').value.trim(),
        contractPeriod: document.getElementById('contractPeriod').value.trim(),
        nextOfKinName: document.getElementById('nextOfKinName').value.trim(),
        nextOfKinMobile: document.getElementById('nextOfKinMobile').value.trim(),
        nextOfKinEmail: document.getElementById('nextOfKinEmail').value.trim(),
        nextOfKinLocation: document.getElementById('nextOfKinLocation').value.trim()
    };

    employeeCount++;
    localStorage.setItem('employeeCount', employeeCount);

    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));

    updateSheet(employee);

    document.getElementById('employeeForm').reset();
    window.location.href = 'empdata.html';
});

// Redirect to the employee data page (empdata.html) on button click
document.getElementById('toggleTableBtn').addEventListener('click', function () {
    window.location.href = 'empdata.html';
});

// Initialize the client on page load
window.onload = initClient;