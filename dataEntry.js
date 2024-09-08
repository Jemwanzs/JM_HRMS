// Validation function
function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const nationalID = document.getElementById('nationalID').value.trim();
    const mobileNumber = document.getElementById('mobileNumber').value.trim();
    const nextOfKinMobile = document.getElementById('nextOfKinMobile').value.trim();
    const privateEmail = document.getElementById('privateEmail').value.trim();
    const workEmail = document.getElementById('workEmail').value.trim();

    const jobTitle = document.getElementById('jobTitle').value.trim();
    const department = document.getElementById('department').value.trim();
    const region = document.getElementById('region').value.trim();
    const salary = document.getElementById('salary').value.trim();

    const employeeType = document.getElementById('employeeType').value.trim();
    const contractStartDate = document.getElementById('contractStartDate').value.trim();

    // Check required fields
    if (!firstName || !lastName || !nationalID || !mobileNumber || !jobTitle || !department || !region || !salary || !privateEmail || !employeeType || !contractStartDate) {
        alert('Please fill in all required fields.');
        return false;
    }

    // Retrieve the employees array from localStorage
    const employees = JSON.parse(localStorage.getItem('employees')) || [];

    // Restrict duplicate National ID
    if (employees.some(employee => employee.nationalID === nationalID)) {
        alert('An employee with this National ID already exists.');
        return false;
    }

    // Restrict duplicate Private Email
    if (employees.some(employee => employee.privateEmail === privateEmail)) {
        alert('An employee with this private email already exists.');
        return false;
    }

    // Restrict duplicate Work Email only if it is not blank
    if (workEmail && employees.some(employee => employee.workEmail === workEmail)) {
        alert('An employee with this work email already exists.');
        return false;
    }


    // Check that Next of Kin Mobile is different from Employee Mobile
    if (mobileNumber === nextOfKinMobile) {
        alert('Employee mobile number and next of kin mobile number cannot be the same.');
        return false;
    }

    return true;
}

///
///


// Function to generate the next employee number
function generateEmployeeNumber() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const lastEmployee = employees[employees.length - 1];
    if (lastEmployee) {
        const lastNumber = parseInt(lastEmployee.employeeNumber.replace('Emp', ''), 10);
        return `Emp${String(lastNumber + 1).padStart(3, '0')}`;
    } else {
        return 'Emp001'; // Initial number
    }
}

// Save employee function
document.getElementById('saveBtn').addEventListener('click', function () {
    if (!validateForm()) {
        return;
    }

    const employee = {
        employeeNumber: generateEmployeeNumber(), // Generate employee number
        firstName: document.getElementById('firstName').value.trim(),
        middleName: document.getElementById('middleName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        nationalID: document.getElementById('nationalID').value.trim(),
        mobileNumber: document.getElementById('mobileNumber').value.trim(),
        privateEmail: document.getElementById('privateEmail').value.trim(),
        workEmail: document.getElementById('workEmail').value.trim(),
        dob: document.getElementById('dob').value.trim(),
        jobTitle: document.getElementById('jobTitle').value.trim(),
        department: document.getElementById('department').value.trim(),
        region: document.getElementById('region').value.trim(),
        salary: document.getElementById('salary').value.trim(),
        employeeType: document.getElementById('employeeType').value.trim(),
        contractStartDate: document.getElementById('contractStartDate').value.trim(),
        contractEndDate: document.getElementById('contractEndDate').value.trim(),
        nextOfKinName: document.getElementById('nextOfKinName').value.trim(),
        nextOfKinMobile: document.getElementById('nextOfKinMobile').value.trim(),
        nextOfKinEmail: document.getElementById('nextOfKinEmail').value.trim(),
        nextOfKinLocation: document.getElementById('nextOfKinLocation').value.trim(),
        active: true // Mark the employee as active by default
    };

    // Retrieve existing employee data from localStorage or initialize an empty array
    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    // Add the new employee to the array
    employees.push(employee);

    // Store the updated employee list back into localStorage
    localStorage.setItem('employees', JSON.stringify(employees));

    // Clear the form after saving
    document.getElementById('employeeForm').reset();

    alert('Employee data saved successfully!');
});


////

///

// Navigate to dataTable.html
document.getElementById('toDataTableBtn').addEventListener('click', function () {
    window.location.href = 'dataTable.html';
});

// Auto-calculate contract period
document.getElementById('contractEndDate').addEventListener('change', function () {
    const startDate = new Date(document.getElementById('contractStartDate').value);
    const endDate = new Date(this.value);
    if (startDate && endDate && endDate > startDate) {
        const diffInTime = endDate.getTime() - startDate.getTime();
        const contractPeriod = Math.ceil(diffInTime / (1000 * 3600 * 24)); // Convert to days
        document.getElementById('contractPeriod').value = contractPeriod;
    } else {
        document.getElementById('contractPeriod').value = ''; // Reset if invalid
    }
});