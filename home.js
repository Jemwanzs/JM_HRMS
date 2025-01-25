// Function to format numbers with commas
function formatWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Load analytics data and populate the dashboard
window.onload = function () {
    updateDashboard();
};

function updateDashboard() {
    // Retrieve payroll data from localStorage
    const employees = JSON.parse(localStorage.getItem('payrollData')) || [];

    // Initialize variables to hold totals
    let totalEmployees = employees.length;
    let totalSalaries = 0;
    let totalDeductions = 0;
    let totalNetPay = 0;
    let tpaye = 0;
    let tnssf = 0;
    let tnhif = 0;
    let tahl = 0;
    let avSalary = 0;

    employees.forEach(employee => {
        const paye = calculatePAYE(employee.grossSalary);
        const nssf = calculateNSSF(employee.grossSalary);
        const nhif = calculateNHIF(employee.grossSalary);
        const ahl = calculateAHL(employee.grossSalary);
        const wht = calculateWHT(employee.grossSalary);
        const otherDeductions = 0; // Initially zero, but editable

        const totalDeductionsForEmployee = paye + nssf + nhif + ahl + wht + otherDeductions;
        const netPay = employee.grossSalary - totalDeductionsForEmployee;
        const averageSalary = (employee.grossSalary / totalEmployees);

        totalSalaries += employee.grossSalary;
        totalDeductions += totalDeductionsForEmployee;
        totalNetPay += netPay;
        tpaye += paye;
        tnssf += nssf;
        tnhif += nhif;
        tahl += ahl;
        avSalary += averageSalary;
    });

    // Update the DOM with the calculated values
    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('totalSalaries').textContent = formatWithCommas(totalSalaries.toFixed(2));
    document.getElementById('totalDeductions').textContent = formatWithCommas(totalDeductions.toFixed(2));
    document.getElementById('totalNetPay').textContent = formatWithCommas(totalNetPay.toFixed(2));
    document.getElementById('tpaye').textContent = formatWithCommas(tpaye.toFixed(2));
    document.getElementById('tnssf').textContent = formatWithCommas(tnssf.toFixed(2));
    document.getElementById('tnhif').textContent = formatWithCommas(tnhif.toFixed(2));
    document.getElementById('tahl').textContent = formatWithCommas(tahl.toFixed(2));
    document.getElementById('avSalary').textContent = formatWithCommas(avSalary.toFixed(2));
}

// Kenyan Payroll Calculations (Formulas)
function calculateNSSF(grossSalary) {
    return Math.min(grossSalary * 0.06, 2160); // 6% of salary capped at Ksh 2160
}

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

function calculateSHIF(grossSalary) {
    return grossSalary * 0.0275;
}

function calculateAHL(grossSalary) {
    return grossSalary * 0.015; // 1.5% of salary
}

function calculatePAYE(grossSalary) {
    const nssfAmount = calculateNSSF(grossSalary);
    const taxableIncome = grossSalary - nssfAmount;
    const nhifAmount = calculateNHIF(grossSalary);
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

function calculateWHT(grossSalary) {
    return grossSalary * 0; // Example: 5% withholding tax (PRINT ZERO-All primary employees)
}