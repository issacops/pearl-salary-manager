// Client-side Payslip PDF Generator
// Uses jsPDF for generating professional payslip PDFs

import { jsPDF } from 'jspdf';
import { Employee, Settings } from '@/types';
import { SalaryBreakdown, AttendanceInfo, numberToWords, MONTH_NAMES } from './payroll';

interface PayslipData {
  employee: Employee;
  settings: Settings;
  month: number;
  year: number;
  salary: SalaryBreakdown;
  attendance: AttendanceInfo;
}

export async function generatePayslipPDF(data: PayslipData): Promise<string> {
  const { employee, settings, month, year, salary, attendance } = data;
  const monthName = MONTH_NAMES[month - 1];

  // Create PDF with custom fonts and styling
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Colors
  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo-600
  const darkColor: [number, number, number] = [30, 41, 59]; // Slate-800
  const grayColor: [number, number, number] = [100, 116, 139]; // Slate-500
  const lightGray: [number, number, number] = [241, 245, 249]; // Slate-100

  let yPos = margin;

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYSLIP', margin, yPos + 8);

  // Month/Year
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${monthName.substring(0, 3).toUpperCase()} ${year}`, pageWidth - margin, yPos + 8, { align: 'right' });

  yPos += 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.company_name || 'PEARL DENTAL SOLUTIONS', margin, yPos);
  yPos += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(settings.address_line1 || '', margin, yPos);
  yPos += 4;
  doc.text(settings.address_line2 || '', margin, yPos);
  yPos += 4;
  doc.text(settings.city_state_zip || '', margin, yPos);

  yPos += 15;

  // Employee Name Box
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPos, contentWidth, 10, 'F');
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPos, 4, 10, 'F');
  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(employee.name.toUpperCase(), margin + 8, yPos + 7);
  yPos += 15;

  // Employee Details Grid
  const colWidth = contentWidth / 4;
  const rowHeight = 12;

  const details = [
    { label: 'Emp No', value: employee.emp_no || '-' },
    { label: 'Date Joined', value: formatDate(employee.date_joined) },
    { label: 'Department', value: employee.department || '-' },
    { label: 'Sub Department', value: employee.sub_department || '-' },
    { label: 'Designation', value: employee.designation },
    { label: 'Payment Mode', value: employee.payment_mode || 'Bank Transfer' },
    { label: 'Bank', value: employee.bank_name || '-' },
    { label: 'Bank IFSC', value: employee.bank_ifsc || '-' },
    { label: 'Bank Account', value: employee.bank_account || '-' },
    { label: 'PAN', value: employee.pan || '-' },
    { label: 'UAN', value: employee.uan || '-' },
    { label: 'PF Number', value: employee.pf_number || 'NA' }
  ];

  doc.setFillColor(...lightGray);
  doc.rect(margin, yPos, contentWidth, rowHeight * 3, 'F');

  details.forEach((detail, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = margin + (col * colWidth) + 3;
    const y = yPos + (row * rowHeight) + 4;

    doc.setTextColor(...grayColor);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(detail.label.toUpperCase(), x, y);

    doc.setTextColor(...darkColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(detail.value, x, y + 4);
  });

  yPos += rowHeight * 3 + 10;

  // Section Title
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, margin + 40, yPos);
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SALARY DETAILS', margin, yPos + 4);
  yPos += 10;

  // Attendance Grid
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPos, contentWidth, rowHeight, 'F');

  const attendanceData = [
    { label: 'Actual Payable Days', value: attendance.actualDaysWorked.toFixed(1) },
    { label: 'Total Working Days', value: attendance.maxWorkableDays.toFixed(1) },
    { label: 'Loss Of Pay Days', value: attendance.lossOfPayDays.toFixed(1) },
    { label: 'Days Payable', value: attendance.actualDaysWorked.toString() }
  ];

  attendanceData.forEach((item, index) => {
    const x = margin + (index * (contentWidth / 4)) + 5;
    doc.setTextColor(...grayColor);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label.toUpperCase(), x, yPos + 4);
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(item.value, x, yPos + 10);
  });

  yPos += rowHeight + 10;

  // Salary Table - Two columns side by side
  const col1X = margin;
  const col2X = margin + (contentWidth / 2) + 5;
  const tableWidth = (contentWidth / 2) - 7;

  // Earnings Column
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('EARNINGS', col1X, yPos);
  doc.text('DEDUCTIONS', col2X, yPos);
  yPos += 5;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(col1X, yPos, col1X + tableWidth, yPos);
  doc.line(col2X, yPos, col2X + tableWidth, yPos);
  yPos += 5;

  // Calculate max rows
  const maxRows = Math.max(salary.earnings.length, salary.deductions.length);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  for (let i = 0; i < maxRows; i++) {
    const earning = salary.earnings[i];
    const deduction = salary.deductions[i];

    if (earning) {
      doc.setTextColor(...darkColor);
      doc.text(earning.name, col1X, yPos);
      doc.text(`₹${earning.amount.toFixed(2)}`, col1X + tableWidth - 25, yPos, { align: 'right' });
    }

    if (deduction) {
      doc.setTextColor(...darkColor);
      doc.text(deduction.name, col2X, yPos);
      doc.text(`₹${deduction.amount.toFixed(2)}`, col2X + tableWidth - 25, yPos, { align: 'right' });
    }

    yPos += 6;
  }

  // Totals
  yPos += 2;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(col1X, yPos, col1X + tableWidth, yPos);
  doc.line(col2X, yPos, col2X + tableWidth, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Total Earnings (A)', col1X, yPos);
  doc.text(`₹${salary.totalEarnings.toFixed(2)}`, col1X + tableWidth - 25, yPos, { align: 'right' });

  doc.text('Total Deductions (C)', col2X, yPos);
  doc.text(`₹${salary.totalDeductions.toFixed(2)}`, col2X + tableWidth - 25, yPos, { align: 'right' });

  yPos += 20;

  // Net Pay Box
  doc.setFillColor(...lightGray);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, contentWidth, 25, 2, 2, 'FD');

  doc.setTextColor(...grayColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Net Salary Payable ( A - C )', margin + 10, yPos + 10);

  doc.setTextColor(...primaryColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${salary.netPay.toFixed(2)}`, pageWidth - margin - 10, yPos + 14, { align: 'right' });

  yPos += 18;
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Net Salary in words:', margin + 10, yPos);

  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.text(`${numberToWords(salary.netPay)} Rupees Only`, margin + 10, yPos + 6);

  yPos += 30;

  // Signatures
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);

  // Employer signature
  doc.line(margin, yPos + 15, margin + 50, yPos + 15);
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text('Employer Signature', margin + 15, yPos + 20);

  // Employee signature
  doc.line(pageWidth - margin - 50, yPos + 15, pageWidth - margin, yPos + 15);
  doc.text('Employee Signature', pageWidth - margin - 40, yPos + 20);

  yPos += 35;

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  doc.setTextColor(...grayColor);
  doc.setFontSize(7);
  doc.text('**Note : All amounts displayed in this payslip are in INR', pageWidth / 2, yPos, { align: 'center' });
  yPos += 3;
  doc.text('*This is a system generated salary slip.', pageWidth / 2, yPos, { align: 'center' });

  // Return as base64 data URL
  return doc.output('dataurlstring');
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '-';
  }
}

// Generate and download PDF
export async function downloadPayslip(data: PayslipData, filename?: string): Promise<void> {
  const pdfDataUrl = await generatePayslipPDF(data);
  
  // Create download link
  const link = document.createElement('a');
  link.href = pdfDataUrl;
  link.download = filename || `Payslip_${data.employee.name}_${MONTH_NAMES[data.month - 1]}_${data.year}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
