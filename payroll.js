// Load payroll data into the table
window.onload = function () {
    loadPayrollData();
};

function loadPayrollData() {
    const payrollTableBody = document.querySelector('#payrollTable tbody');
    payrollTableBody.innerHTML = '';

    // Retrieve payroll data from localStorage
    const employees = JSON.parse(localStorage.getItem('payrollData')) || [];

    employees.forEach((employee, index) => {
        const paye = calculatePAYE(employee.grossSalary);
        const nssf = calculateNSSF(employee.grossSalary);
        const nhif = calculateNHIF(employee.grossSalary);
        const ahl = calculateAHL(employee.grossSalary);
        const wht = calculateWHT(employee.grossSalary);
        const otherDeductions = 0; // Initially zero, but editable
        const totalDeductions = paye + nssf + nhif + ahl + wht + otherDeductions;
        const netPay = employee.grossSalary - totalDeductions;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${employee.employeeNumber}</td>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.jobTitle}</td>
            <td>${employee.department}</td>
            <td>${formatWithCommas(employee.grossSalary.toFixed(2))}</td>
            <td>${formatWithCommas(paye.toFixed(2))}</td>
            <td>${formatWithCommas(nssf.toFixed(2))}</td>
            <td>${formatWithCommas(nhif.toFixed(2))}</td>
            <td>${formatWithCommas(ahl.toFixed(2))}</td>
            <td>${formatWithCommas(wht.toFixed(2))}</td>
            <td><input type="number" id="otherDeductions-${index}" value="${otherDeductions.toFixed(2)}" class="other-deductions" data-index="${index}"></td>
            <td id="totalDeductions-${index}">${formatWithCommas(totalDeductions.toFixed(2))}</td>
            <td id="netPay-${index}">${formatWithCommas(netPay.toFixed(2))}</td>
            <td><button onclick="generatePayslip(${index})">Salary Slip</button></td>
        `;

        payrollTableBody.appendChild(row);
    });

    // Add event listeners to handle other deductions edits
    document.querySelectorAll('.other-deductions').forEach(input => {
        input.addEventListener('change', function () {
            const index = this.getAttribute('data-index');
            const otherDeductions = parseFloat(this.value) || 0;
            updatePayrollRow(index, otherDeductions);
        });
    });
}


function updatePayrollRow(index, otherDeductions) {
    const employees = JSON.parse(localStorage.getItem('payrollData')) || [];
    const employee = employees[index];
    const paye = calculatePAYE(employee.grossSalary);
    const nssf = calculateNSSF(employee.grossSalary);
    const nhif = calculateNHIF(employee.grossSalary);
    const ahl = calculateAHL(employee.grossSalary);
    const wht = calculateWHT(employee.grossSalary);
    const totalDeductions = paye + nssf + nhif + ahl + wht + otherDeductions;
    const netPay = employee.grossSalary - totalDeductions;

    document.getElementById(`totalDeductions-${index}`).textContent = totalDeductions.toFixed(2);
    document.getElementById(`netPay-${index}`).textContent = netPay.toFixed(2);

    // Update the row with formatted values using commas
    document.getElementById(`totalDeductions-${index}`).textContent = formatWithCommas(totalDeductions.toFixed(2));
    document.getElementById(`netPay-${index}`).textContent = formatWithCommas(netPay.toFixed(2));
}

// Kenyan Payroll Calculations (Formulas)


// NSSF Calculation (2024 rates)
function calculateNSSF(grossSalary) {
    return Math.min(grossSalary * 0.06, 2160); // 6% of salary capped at Ksh 2160
}

// NHIF Calculation (Based on salary ranges)
function calculateNHIF(grossSalary) {
    if (grossSalary <= 5999) return 150;
    if (grossSalary <= 7999) return 300;
    if (grossSalary <= 11999) return 400;
    if (grossSalary <= 14999) return 500;
    if (grossSalary <= 19999) return 600;
    if (grossSalary <= 24999) return 750;
    if (grossSalary <= 29999) return 850;
    if (grossSalary <= 34999) return 900;
    if (grossSalary <= 39999) return 950;
    if (grossSalary <= 44999) return 1000;
    if (grossSalary <= 49999) return 1100;
    if (grossSalary <= 59999) return 1200;
    if (grossSalary <= 69999) return 1300;
    if (grossSalary <= 79999) return 1400;
    if (grossSalary <= 89999) return 1500;
    if (grossSalary <= 99999) return 1600;
    return 1700; // Max NHIF contribution
}

// AHL Calculation (Assumed at a flat rate for demonstration)
function calculateAHL(grossSalary) {
    return grossSalary * 0.015; // 1.5% of salary
}

// PAYE Calculation (Simplified example)
function calculatePAYE(grossSalary) {
    const nssfAmount = calculateNSSF(grossSalary);
    const taxableIncome = grossSalary - nssfAmount;
    const nhifAmount = calculateNHIF(grossSalary);
    // Tax Reliefs--------------
    const personalRelief = 2400;
    const insuranceRelief = 0.15 * nhifAmount;
    const ahlAmount = calculateAHL(grossSalary);
    const ahlRelief = 0.15 * ahlAmount;

    if (taxableIncome <= 24000) {
        return taxableIncome * 0.10 - (personalRelief + insuranceRelief + ahlRelief);
    } else if (taxableIncome > 24000 && taxableIncome <= 32333) {
        return (24000 * 0.10 + (taxableIncome - 24000) * 0.25) - (personalRelief + insuranceRelief + ahlRelief);
    } else if (taxableIncome > 32333 && taxableIncome <= 500000) {
        return (24000 * 0.10 + 8333 * 0.25 + (taxableIncome - 32333) * 0.30) - (personalRelief + insuranceRelief + ahlRelief);
    } else if (taxableIncome > 500000 && taxableIncome <= 800000) {
        return (24000 * 0.10 + 8333 * 0.25 + (500000 - 32333) * 0.30 + (taxableIncome - 500000) * 0.325) - (personalRelief + insuranceRelief + ahlRelief);
    } else {
        return (24000 * 0.10 + 8333 * 0.25 + (500000 - 32333) * 0.30 + (800000 - 500000) * 0.325 + (taxableIncome - 800000) * 0.35) - (personalRelief + insuranceRelief + ahlRelief);
    }
}

// Withholding Tax (WHT) Calculation (if applicable)
function calculateWHT(grossSalary) {
    return grossSalary * 0; // Example: 5% withholding tax (PRINT ZERO-All primary employees)
}

function formatWithCommas(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//
//
//
// Format numbers with commas
function formatWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Generate and print payslip as PDF
async function generatePayslip(index) {
    const { jsPDF } = window.jspdf;

    // Create a new jsPDF instance with A5 paper size
    const doc = new jsPDF({
        orientation: "portrait", // or "landscape" if needed
        unit: "mm", // Use millimeters as the unit
        format: [148, 210] // A5 paper size dimensions
    });

    // Retrieve data from localStorage
    const employees = JSON.parse(localStorage.getItem('payrollData')) || [];
    const employee = employees[index];
    const paye = calculatePAYE(employee.grossSalary);
    const nssf = calculateNSSF(employee.grossSalary);
    const nhif = calculateNHIF(employee.grossSalary);
    const ahl = calculateAHL(employee.grossSalary);
    const wht = calculateWHT(employee.grossSalary);
    const otherDeductions = parseFloat(document.getElementById(`otherDeductions-${index}`).value) || 0;
    const totalDeductions = paye + nssf + nhif + ahl + wht + otherDeductions;
    const netPay = employee.grossSalary - totalDeductions;

    // Retrieve company name and payroll period from inputs
    const companyName = document.getElementById('companyName').value || 'Company Name';
    const payrollPeriod = document.getElementById('payrollPeriod').value || 'Payroll Period';

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Center-align titles with enhanced styling
    const title1 = 'Salary Slip';
    const title2 = companyName;
    const title3 = payrollPeriod;

    const pageWidth = doc.internal.pageSize.width;

    // Title 1 (Salary Slip)
    doc.setFontSize(16); // Larger font size for the title
    doc.setFont("helvetica", "bold"); // Bold
    const title1Width = doc.getTextWidth(title1);
    const xTitle1 = (pageWidth - title1Width) / 2;
    doc.text(title1, xTitle1, 10);

    // Title 2 (Company Name)
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    const title2Width = doc.getTextWidth(title2);
    const xTitle2 = (pageWidth - title2Width) / 2;
    doc.text(title2, xTitle2, 20);

    // Title 3 (Payroll Period)
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    const title3Width = doc.getTextWidth(title3);
    const xTitle3 = (pageWidth - title3Width) / 2;
    doc.text(title3, xTitle3, 30);

    // Add employee details with left-aligned titles and right-aligned amounts
    const xOffsetTitle = 10; // Adjusted for A5 size
    const xOffsetAmount = pageWidth - 20; // Adjusted for A5 size

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Format and print employee details
    doc.text('Employee Number:', xOffsetTitle, 50);
    doc.text(employee.employeeNumber.toString(), xOffsetAmount, 50, { align: 'right' });

    doc.text('Name:', xOffsetTitle, 60);
    doc.text(`${employee.firstName} ${employee.lastName}`, xOffsetAmount, 60, { align: 'right' });

    doc.text('Job Title:', xOffsetTitle, 70);
    doc.text(employee.jobTitle, xOffsetAmount, 70, { align: 'right' });

    doc.text('Department:', xOffsetTitle, 80);
    doc.text(employee.department, xOffsetAmount, 80, { align: 'right' });

    // Format monetary values with commas and fixed decimal points
    doc.text('Gross Salary:', xOffsetTitle, 100);
    doc.text(formatWithCommas(employee.grossSalary.toFixed(2)), xOffsetAmount, 100, { align: 'right' });

    doc.text('PAYE:', xOffsetTitle, 110);
    doc.text(formatWithCommas(paye.toFixed(2)), xOffsetAmount, 110, { align: 'right' });

    doc.text('NSSF:', xOffsetTitle, 120);
    doc.text(formatWithCommas(nssf.toFixed(2)), xOffsetAmount, 120, { align: 'right' });

    doc.text('NHIF:', xOffsetTitle, 130);
    doc.text(formatWithCommas(nhif.toFixed(2)), xOffsetAmount, 130, { align: 'right' });

    doc.text('AHL:', xOffsetTitle, 140);
    doc.text(formatWithCommas(ahl.toFixed(2)), xOffsetAmount, 140, { align: 'right' });

    doc.text('WHT:', xOffsetTitle, 150);
    doc.text(formatWithCommas(wht.toFixed(2)), xOffsetAmount, 150, { align: 'right' });

    doc.text('Other Deductions:', xOffsetTitle, 160);
    doc.text(formatWithCommas(otherDeductions.toFixed(2)), xOffsetAmount, 160, { align: 'right' });

    doc.text('Total Deductions:', xOffsetTitle, 170);
    doc.text(formatWithCommas(totalDeductions.toFixed(2)), xOffsetAmount, 170, { align: 'right' });

    doc.text('Net Pay:', xOffsetTitle, 180);
    doc.text(formatWithCommas(netPay.toFixed(2)), xOffsetAmount, 180, { align: 'right' });

    // Save the PDF
    doc.save(`Payslip_${employee.employeeNumber}.pdf`);
}