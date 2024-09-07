// script.js

let employeeCount = localStorage.getItem('employeeCount') ? parseInt(localStorage.getItem('employeeCount')) : 1;
let employees = JSON.parse(localStorage.getItem('employees')) || [];

// Helper function to format employee registration number
function getEmployeeRegNo(count) {
    return `Emp${count.toString().padStart(3, '0')}`;
}

// Function to validate required fields
function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const nationalID = document.getElementById('nationalID').value.trim();
    const jobTitle = document.getElementById('jobTitle').value;
    const department = document.getElementById('department').value;
    const region = document.getElementById('region').value;

    // Check if required fields are filled
    if (!firstName || !lastName || !nationalID || !jobTitle || !department || !region) {
        alert('Please fill in all required fields.');
        return false;
    }

    // Additional validation can be added here (e.g., valid email format)

    return true;
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

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const jobTitle = document.getElementById('jobTitle').value;
    const department = document.getElementById('department').value;
    const region = document.getElementById('region').value;

    // Generate employee registration number
    const regNo = getEmployeeRegNo(employeeCount);
    employeeCount++; // Increment the employee counter
    localStorage.setItem('employeeCount', employeeCount); // Save the new employee count

    // Create new employee object
    const newEmployee = {
        regNo,
        firstName,
        lastName,
        nationalID,
        jobTitle,
        department,
        region
    };

    // Add new employee to the array
    employees.push(newEmployee);

    // Save employee data to localStorage
    localStorage.setItem('employees', JSON.stringify(employees));

    // Optionally, you can clear the form after saving
    document.getElementById('employeeForm').reset();

    // Redirect to the employee data page (empdata.html)
    window.location.href = 'empdata.html';
});

// Redirect to the employee data page (empdata.html) on button click
document.getElementById('toggleTableBtn').addEventListener('click', function () {
    // Redirect the user to empdata.html
    window.location.href = 'empdata.html';
});
