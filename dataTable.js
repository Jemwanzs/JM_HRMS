// Global variables
let deleteIndex = null;

// Load employee data into tables
window.onload = function () {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];

    const activeTableBody = document.querySelector('#activeEmployeeTable tbody');
    const inactiveTableBody = document.querySelector('#inactiveEmployeeTable tbody');

    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.employeeNumber}</td>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.jobTitle}</td>
            <td>${employee.department}</td>
            <td>${employee.salary}</td>
            <td>${employee.contractStartDate}</td>
            <td>${employee.contractEndDate}</td>
            <td>${employee.nextOfKinName}</td>
            <td>
                ${employee.active ?
                `<button class="terminate-btn" data-index="${index}">Terminate</button>` :
                `<button class="activate-btn" data-index="${index}">Activate</button>`
            }
            </td>
        `;

        if (employee.active) {
            activeTableBody.appendChild(row);
        } else {
            inactiveTableBody.appendChild(row);
        }
    });

    // Add event listeners for terminate buttons
    document.querySelectorAll('.terminate-btn').forEach(button => {
        button.addEventListener('click', function () {
            deleteIndex = this.getAttribute('data-index');
            document.getElementById('terminationModal').style.display = 'block';
        });
    });

    // Add event listeners for activate buttons
    document.querySelectorAll('.activate-btn').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            activateEmployee(index);
        });
    });

    // Modal close button
    document.querySelector('.close').addEventListener('click', function () {
        document.getElementById('terminationModal').style.display = 'none';
    });

    // Confirm termination button
    document.getElementById('confirmDelete').addEventListener('click', function () {
        const terminationDate = document.getElementById('terminationDate').value;
        const reasons = document.getElementById('terminationReasons').value;
        const noticePeriod = document.getElementById('noticePeriod').value;
        const terminalDues = document.getElementById('terminalDues').value;

        // Call validation function before termination
        const isValid = validateTerminationForm(terminationDate, reasons, noticePeriod, terminalDues);

        if (isValid) {
            terminateEmployee(deleteIndex, terminationDate, reasons, noticePeriod, terminalDues);
        }
    });

    // Reset button functionality
    document.getElementById('resetDataBtn').addEventListener('click', function () {
        if (confirm('Are you sure you want to reset all employee data? This action cannot be undone.')) {
            localStorage.removeItem('employees');
            updateTables();
        }
    });
};

// Function to activate an employee
function activateEmployee(index) {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const employee = employees[index];

    // Reactivate the employee
    employee.active = true;
    employee.terminationDetails = null;

    // Update the employee data in localStorage
    employees[index] = employee;
    localStorage.setItem('employees', JSON.stringify(employees));

    // Update the tables to reflect the changes
    updateTables();
}

// Validate termination form inputs
function validateTerminationForm(terminationDate, reasons, noticePeriod, terminalDues) {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.remove());

    // Validate termination date
    if (!terminationDate) {
        showError('terminationDate', 'Termination date is required.');
        isValid = false;
    }

    // Validate reasons
    if (!reasons.trim()) {
        showError('terminationReasons', 'Termination reasons are required.');
        isValid = false;
    }

    // Validate notice period (should be a non-negative number)
    if (noticePeriod === '' || isNaN(noticePeriod) || noticePeriod < 0) {
        showError('noticePeriod', 'Notice period must be a non-negative number.');
        isValid = false;
    }

    // Validate terminal dues (should be a non-negative number)
    if (terminalDues === '' || isNaN(terminalDues) || terminalDues < 0) {
        showError('terminalDues', 'Terminal dues must be a non-negative number.');
        isValid = false;
    }

    return isValid;
}

// Function to show error messages next to the input fields
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('div');
    error.classList.add('error');
    error.textContent = message;
    field.parentElement.appendChild(error);
}

// Function to terminate an employee
function terminateEmployee(index, terminationDate, reasons, noticePeriod, terminalDues) {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const employee = employees[index];

    // Add termination details
    employee.active = false;
    employee.terminationDetails = {
        date: terminationDate,
        reasons: reasons,
        noticePeriod: noticePeriod,
        terminalDues: terminalDues
    };

    // Update the employee data in localStorage
    employees[index] = employee;
    localStorage.setItem('employees', JSON.stringify(employees));

    // Update the tables to reflect the changes
    updateTables();

    // Close the modal
    document.getElementById('terminationModal').style.display = 'none';
}

// Function to update tables
function updateTables() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];

    const activeTableBody = document.querySelector('#activeEmployeeTable tbody');
    const inactiveTableBody = document.querySelector('#inactiveEmployeeTable tbody');

    activeTableBody.innerHTML = '';
    inactiveTableBody.innerHTML = '';

    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.employeeNumber}</td>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.jobTitle}</td>
            <td>${employee.department}</td>
            <td>${employee.salary}</td>
            <td>${employee.contractStartDate}</td>
            <td>${employee.contractEndDate}</td>
            <td>${employee.nextOfKinName}</td>
            <td>
                ${employee.active ?
                `<button class="terminate-btn" data-index="${index}">Terminate</button>` :
                `<button class="activate-btn" data-index="${index}">Activate</button>`
            }
            </td>
        `;

        if (employee.active) {
            activeTableBody.appendChild(row);
        } else {
            inactiveTableBody.appendChild(row);
        }
    });

    // Re-add event listeners for buttons in newly populated rows
    document.querySelectorAll('.terminate-btn').forEach(button => {
        button.addEventListener('click', function () {
            deleteIndex = this.getAttribute('data-index');
            document.getElementById('terminationModal').style.display = 'block';
        });
    });

    document.querySelectorAll('.activate-btn').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            activateEmployee(index);
        });
    });
}

// Search functionality for active employees
document.getElementById('searchBar').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();
    const rows = document.querySelectorAll('#activeEmployeeTable tbody tr');

    rows.forEach(row => {
        // Extract the text content from each relevant cell
        const employeeNumber = row.cells[0].textContent.toLowerCase();
        const firstName = row.cells[1].textContent.toLowerCase();
        const lastName = row.cells[2].textContent.toLowerCase();
        const jobTitle = row.cells[3].textContent.toLowerCase();

        // Check if any of the cells include the search query
        const matches = employeeNumber.includes(searchQuery) ||
            firstName.includes(searchQuery) ||
            lastName.includes(searchQuery) ||
            jobTitle.includes(searchQuery);

        // Display the row if there's a match, otherwise hide it
        row.style.display = matches ? '' : 'none';
    });
});

// Search functionality for inactive employees
document.getElementById('searchBar').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();
    const rows = document.querySelectorAll('#inactiveEmployeeTable tbody tr');

    rows.forEach(row => {
        // Extract the text content from each relevant cell
        const employeeNumber = row.cells[0].textContent.toLowerCase();
        const firstName = row.cells[1].textContent.toLowerCase();
        const lastName = row.cells[2].textContent.toLowerCase();
        const jobTitle = row.cells[3].textContent.toLowerCase();

        // Check if any of the cells include the search query
        const matches = employeeNumber.includes(searchQuery) ||
            firstName.includes(searchQuery) ||
            lastName.includes(searchQuery) ||
            jobTitle.includes(searchQuery);

        // Display the row if there's a match, otherwise hide it
        row.style.display = matches ? '' : 'none';
    });
});


// Add this function to handle the transfer of active employees
document.getElementById('viewPayrollBtn').addEventListener('click', function () {
    const activeEmployees = Array.from(document.querySelectorAll('#activeEmployeeTable tbody tr')).map(row => {
        const cells = row.getElementsByTagName('td');
        return {
            employeeNumber: cells[0].textContent,
            firstName: cells[1].textContent,
            lastName: cells[2].textContent,
            jobTitle: cells[3].textContent,
            department: cells[4].textContent,
            grossSalary: parseFloat(cells[5].textContent.replace(/,/g, ''))
        };
    });

    // Save active employees data to localStorage
    localStorage.setItem('payrollData', JSON.stringify(activeEmployees));
    // Redirect to payroll.html
    window.location.href = 'payroll.html';
});