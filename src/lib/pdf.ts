import { jsPDF } from 'jspdf';
import { Employee, Settings } from '@/types';

export interface PayslipData {
  employee: Employee;
  settings: Settings;
  month: number;
  year: number;
  salary: {
    earnings: Array<{ name: string; amount: number }>;
    deductions: Array<{ name: string; amount: number }>;
    totalEarnings: number;
    totalDeductions: number;
    netPay: number;
    grossSalary?: number;
  };
  attendance: {
    actualDaysWorked: number;
    maxWorkableDays: number;
    lossOfPayDays: number;
  };
}

// Indian Number to Words Conversion
function numberToWords(num: number): string {
  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const places = ['', 'Thousand', 'Lakh', 'Crore'];

  function convert(n: number, index: number): string {
    if (n === 0) return '';
    if (n < 10) return single[n] + ' ';
    if (n < 20) return double[n - 10] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + single[n % 10] : '') + ' ';
    return single[Math.floor(n / 100)] + ' Hundred ' + (n % 100 !== 0 ? 'and ' + convert(n % 100, 0) : '');
  }

  function getAllWords(n: number): string {
    if (n === 0) return 'Zero';
    let words = '';
    let placeIndex = 0;
    while (n > 0) {
      const chunk = n % 100;
      if (chunk !== 0) {
        const chunkWords = convert(chunk, placeIndex);
        words = chunkWords + places[placeIndex] + ' ' + words;
      }
      n = Math.floor(n / 100);
      placeIndex++;
    }
    return words.trim();
  }

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let result = 'Rupees ' + getAllWords(rupees);
  if (paise > 0) {
    result += ' and ' + getAllWords(paise) + ' Paise';
  }
  return result + ' Only';
}

// Format currency
function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Mask account number
function maskAccountNumber(account: string): string {
  if (!account || account.length < 4) return account || 'N/A';
  return '****' + account.slice(-4);
}

// Hide if empty
function displayValue(value: string): string {
  if (!value || value === '-' || value === '') return '';
  return value;
}

export async function generatePayslipPDF(data: PayslipData): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Colors
  const primaryColor = '#14b8a6'; // Teal from logo
  const secondaryColor = '#f97316'; // Orange from logo
  const darkText = '#0f172a';
  const lightText = '#64748b';
  const borderColor = '#e2e8f0';

  const margin = 10;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Helper to add text
  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; font?: string; color?: string; align?: 'left' | 'center' | 'right' }) => {
    const fontSize = options?.fontSize || 10;
    const color = options?.color || darkText;
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    if (options?.align === 'center') {
      doc.text(text, x, y, { align: 'center' });
    } else if (options?.align === 'right') {
      doc.text(text, x, y, { align: 'right' });
    } else {
      doc.text(text, x, y);
    }
  };

  // Helper to draw line
  const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string = borderColor) => {
    doc.setDrawColor(color);
    doc.setLineWidth(0.5);
    doc.line(x1, y1, x2, y2);
  };

  // Helper to draw filled rect
  const drawRect = (x: number, y: number, w: number, h: number, fillColor: string, borderColorStr?: string) => {
    doc.setFillColor(fillColor);
    if (borderColorStr) {
      doc.setDrawColor(borderColorStr);
      doc.rect(x, y, w, h, 'FD');
    } else {
      doc.rect(x, y, w, h, 'F');
    }
  };

  // Get month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[data.month - 1] || 'Unknown';

  // ==================== HEADER SECTION ====================
  // Teal header background
  drawRect(margin, yPos, contentWidth, 22, primaryColor);
  
  // Logo area (left)
  try {
    doc.addImage('/logo.png', 'PNG', margin + 3, yPos + 3, 16, 16);
  } catch {
    // If logo fails, show text placeholder
    addText('PD', margin + 8, yPos + 12, { fontSize: 12, color: '#ffffff' });
  }
  
  // Company name
  addText('PEARL DENTAL SOLUTIONS', margin + 22, yPos + 8, { fontSize: 14, color: '#ffffff', font: 'helvetica' });
  addText('Building no. IX/105, Kinginimattom (PO) Palackamttom', margin + 22, yPos + 13, { fontSize: 7, color: '#e0f2fe' });
  addText('Kolenchery, Ernakulam, Kerala - 682311', margin + 22, yPos + 17, { fontSize: 7, color: '#e0f2fe' });
  
  // Payslip title and date (right)
  addText('PAYSLIP', pageWidth - margin - 5, yPos + 8, { fontSize: 16, color: '#ffffff', align: 'right', font: 'helvetica' });
  addText(`${data.month} ${data.year}`, pageWidth - margin - 5, yPos + 15, { fontSize: 11, color: '#e0f2fe', align: 'right' });
  
  yPos += 24;
  
  // GST and contact info
  addText(`GST: 32BJZPJ4929C1ZO | Phone: +91-7593844590, +91-7593844592`, margin, yPos, { fontSize: 8, color: lightText });
  yPos += 5;

  // ==================== EMPLOYEE INFO SECTION ====================
  yPos += 3;
  drawRect(margin, yPos, contentWidth, 30, '#f0fdfa', borderColor);
  
  // Employee name and designation
  addText(data.employee.name.toUpperCase(), margin + 5, yPos + 8, { fontSize: 13, color: primaryColor, font: 'helvetica' });
  addText(data.employee.designation, margin + 5, yPos + 13, { fontSize: 10, color: lightText });
  
  // Employee details grid
  let col1X = margin + 5;
  let col2X = margin + 70;
  let col3X = margin + 135;
  let infoY = yPos + 20;
  
  // Row 1
  const empNo = data.employee.emp_no || '';
  const department = data.employee.department || '';
  const dateJoined = data.employee.date_joined || '';
  const paymentMode = data.employee.payment_mode || '';
  const bankName = data.employee.bank_name || '';
  const bankAccount = data.employee.bank_account || '';
  const pan = data.employee.pan || '';
  const uan = data.employee.uan || '';
  
  if (displayValue(empNo)) {
    addText('Emp ID:', col1X, infoY, { fontSize: 8, color: lightText });
    addText(empNo, col1X + 18, infoY, { fontSize: 9, color: darkText });
  }
  
  if (displayValue(department)) {
    addText('Department:', col2X, infoY, { fontSize: 8, color: lightText });
    addText(department, col2X + 25, infoY, { fontSize: 9, color: darkText });
  }
  
  if (displayValue(dateJoined)) {
    addText('Joined:', col3X, infoY, { fontSize: 8, color: lightText });
    addText(dateJoined, col3X + 18, infoY, { fontSize: 9, color: darkText });
  }
  
  infoY += 5;
  
  // Row 2
  if (displayValue(paymentMode)) {
    addText('Payment:', col1X, infoY, { fontSize: 8, color: lightText });
    addText(paymentMode, col1X + 18, infoY, { fontSize: 9, color: darkText });
  }
  
  if (displayValue(bankName)) {
    addText('Bank:', col2X, infoY, { fontSize: 8, color: lightText });
    addText(bankName, col2X + 18, infoY, { fontSize: 9, color: darkText });
  }
  
  if (displayValue(bankAccount)) {
    addText('A/C:', col3X, infoY, { fontSize: 8, color: lightText });
    addText(maskAccountNumber(bankAccount), col3X + 12, infoY, { fontSize: 9, color: darkText });
  }
  
  infoY += 5;
  
  // Row 3
  if (displayValue(pan)) {
    addText('PAN:', col1X, infoY, { fontSize: 8, color: lightText });
    addText(pan, col1X + 12, infoY, { fontSize: 9, color: darkText });
  }
  
  if (displayValue(uan)) {
    addText('UAN:', col2X, infoY, { fontSize: 8, color: lightText });
    addText(uan, col2X + 15, infoY, { fontSize: 9, color: darkText });
  }
  
  yPos += 33;

  // ==================== ATTENDANCE & PAY SUMMARY ====================
  drawRect(margin, yPos, contentWidth, 12, '#fff7ed', borderColor);
  
  const summaryItems = [
    { label: 'Period:', value: `${monthName} ${data.year}` },
    { label: 'Working Days:', value: data.attendance.maxWorkableDays.toString() },
    { label: 'Present:', value: data.attendance.actualDaysWorked.toString() },
    { label: 'LOP:', value: data.attendance.lossOfPayDays.toString() }
  ];
  
  let summaryX = margin + 5;
  summaryItems.forEach((item, index) => {
    if (index > 0) summaryX += 40;
    addText(item.label, summaryX, yPos + 5, { fontSize: 8, color: lightText });
    addText(item.value, summaryX, yPos + 10, { fontSize: 9, color: darkText });
  });
  
  yPos += 14;

  // ==================== EARNINGS & DEDUCTIONS ====================
  const tableStartY = yPos;
  const colWidth = contentWidth / 2;
  const rowHeight = 7;
  
  // Headers
  drawRect(margin, tableStartY, colWidth - 2, rowHeight, primaryColor);
  drawRect(margin + colWidth, tableStartY, colWidth - 2, rowHeight, primaryColor);
  
  addText('EARNINGS', margin + colWidth / 2 - 1, tableStartY + 5, { fontSize: 10, color: '#ffffff', align: 'center', font: 'helvetica' });
  addText('DEDUCTIONS', margin + colWidth + colWidth / 2 - 1, tableStartY + 5, { fontSize: 10, color: '#ffffff', align: 'center', font: 'helvetica' });
  
  yPos = tableStartY + rowHeight;
  
  // Calculate max rows needed
  const maxRows = Math.max(data.salary.earnings.length, data.salary.deductions.length);
  
  for (let i = 0; i < maxRows; i++) {
    const isEven = i % 2 === 0;
    const bgColor = isEven ? '#ffffff' : '#f8fafc';
    
    // Earnings row
    if (data.salary.earnings[i]) {
      drawRect(margin, yPos, colWidth - 2, rowHeight, bgColor);
      addText(data.salary.earnings[i].name, margin + 3, yPos + 5, { fontSize: 9, color: darkText });
      addText(formatCurrency(data.salary.earnings[i].amount), margin + colWidth - 5, yPos + 5, { fontSize: 9, color: darkText, align: 'right' });
    } else {
      drawRect(margin, yPos, colWidth - 2, rowHeight, bgColor);
    }
    
    // Deductions row
    if (data.salary.deductions[i]) {
      drawRect(margin + colWidth, yPos, colWidth - 2, rowHeight, bgColor);
      addText(data.salary.deductions[i].name, margin + colWidth + 3, yPos + 5, { fontSize: 9, color: darkText });
      addText(formatCurrency(data.salary.deductions[i].amount), margin + contentWidth - 5, yPos + 5, { fontSize: 9, color: darkText, align: 'right' });
    } else {
      drawRect(margin + colWidth, yPos, colWidth - 2, rowHeight, bgColor);
    }
    
    yPos += rowHeight;
  }
  
  // Totals row
  drawRect(margin, yPos, colWidth - 2, rowHeight, '#e0f2fe');
  drawRect(margin + colWidth, yPos, colWidth - 2, rowHeight, '#fee2e2');
  
  addText('Total Earnings', margin + 3, yPos + 5, { fontSize: 9, color: primaryColor, font: 'helvetica' });
  addText(formatCurrency(data.salary.totalEarnings), margin + colWidth - 5, yPos + 5, { fontSize: 9, color: primaryColor, align: 'right', font: 'helvetica' });

  addText('Total Deductions', margin + colWidth + 3, yPos + 5, { fontSize: 9, color: secondaryColor, font: 'helvetica' });
  addText(formatCurrency(data.salary.totalDeductions), margin + contentWidth - 5, yPos + 5, { fontSize: 9, color: secondaryColor, align: 'right', font: 'helvetica' });
  
  yPos += rowHeight + 3;

  // ==================== NET PAY SECTION ====================
  const netPayHeight = 20;
  drawRect(margin, yPos, contentWidth, netPayHeight, '#f0fdfa', borderColor);
  
  // Net pay label
  addText('NET SALARY PAYABLE', margin + 5, yPos + 6, { fontSize: 9, color: lightText });
  
  // Net pay amount
  addText(formatCurrency(data.salary.netPay), pageWidth - margin - 5, yPos + 8, { fontSize: 16, color: primaryColor, align: 'right', font: 'helvetica' });

  // Amount in words
  const amountWords = numberToWords(data.salary.netPay);
  addText(amountWords, margin + 5, yPos + 16, { fontSize: 9, color: lightText });
  
  yPos += netPayHeight + 5;

  // ==================== FOOTER ====================
  const footerY = 280; // Fixed position near bottom
  
  // Computer generated notice
  addText('This is a computer generated payslip and does not require signature.', pageWidth / 2, footerY, { fontSize: 8, color: lightText, align: 'center' });
  
  // Date generated and website
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  addText(`Generated on: ${today} | www.pearldental.care`, pageWidth / 2, footerY + 4, { fontSize: 7, color: lightText, align: 'center' });
  
  // Bottom border line
  drawLine(margin, 292, pageWidth - margin, 292, primaryColor);

  // Return as data URL
  return doc.output('dataurlstring');
}

// Generate and download PDF
export async function downloadPayslip(data: PayslipData, filename?: string): Promise<void> {
  const pdfDataUrl = await generatePayslipPDF(data);
  
  // Create download link
  const link = document.createElement('a');
  link.href = pdfDataUrl;
  link.download = filename || `Payslip_${data.employee.name}_${data.month}_${data.year}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default {
  generatePayslipPDF,
  downloadPayslip
};