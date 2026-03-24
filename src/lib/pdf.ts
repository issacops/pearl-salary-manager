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

// Indian Number to Words Conversion (Lakhs & Crores)
function numberToWords(num: number): string {
  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertChunk(n: number): string {
    if (n === 0) return '';
    if (n < 10) return single[n];
    if (n < 20) return double[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + single[n % 10] : '');
    return single[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertChunk(n % 100) : '');
  }

  if (num === 0) return 'Zero';

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let words = '';
  
  if (rupees >= 10000000) {
    words += convertChunk(Math.floor(rupees / 10000000)) + ' Crore ';
  }
  const lakhsPart = rupees % 10000000;
  if (lakhsPart >= 100000) {
    words += convertChunk(Math.floor(lakhsPart / 100000)) + ' Lakh ';
  }
  const thousandsPart = lakhsPart % 100000;
  if (thousandsPart >= 1000) {
    words += convertChunk(Math.floor(thousandsPart / 1000)) + ' Thousand ';
  }
  const remainder = thousandsPart % 1000;
  if (remainder > 0) {
    words += convertChunk(remainder);
  }

  let result = 'Rupees ' + words.trim();
  if (paise > 0) {
    result += ' and ' + convertChunk(paise) + ' Paise';
  }
  return result + ' Only';
}

// Truncate text to fit width
function truncateText(text: string, maxWidth: number, fontSize: number, doc: jsPDF): string {
  if (text.length <= 20) return text;
  return text.substring(0, 17) + '...';
}

// Format currency - use Rs. instead of symbol for compatibility
function formatCurrency(amount: number): string {
  return 'Rs. ' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Mask account number
function maskAccountNumber(account: string): string {
  if (!account || account.length < 4) return account || 'N/A';
  return '****' + account.slice(-4);
}

// Hide if empty
function displayValue(value: string | undefined | null): string {
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
  const primaryColor = '#2dd4bf';
  const secondaryColor = '#f97316';
  const darkText = '#1e293b';
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

  // Helper to draw filled rect
  const drawRect = (x: number, y: number, w: number, h: number, fillColor: string, borderColorStr?: string) => {
    doc.setFillColor(fillColor);
    if (borderColorStr) {
      doc.setDrawColor(borderColorStr);
      doc.rect(x, y, w, h, 'FD');
    } else {
      doc.setDrawColor(borderColor);
      doc.rect(x, y, w, h, 'F');
    }
  };

  // Get month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[data.month - 1] || 'Unknown';

  // ==================== HEADER SECTION ====================
  drawRect(margin, yPos, contentWidth, 24, primaryColor);
  
  // Logo area (left) - maintain aspect ratio (logo is ~3:1 width:height)
  const logoWidth = 48; // mm - wider to match aspect ratio
  const logoHeight = 16; // mm
  try {
    doc.addImage('/logo.png', 'PNG', margin + 3, yPos + 4, logoWidth, logoHeight);
  } catch {
    addText('PD', margin + 8, yPos + 13, { fontSize: 12, color: '#ffffff' });
  }
  
  // Company name (positioned to the right of logo)
  const textStartX = margin + 3 + logoWidth + 5;
  addText('PEARL DENTAL SOLUTIONS', textStartX, yPos + 9, { fontSize: 12, color: '#ffffff', font: 'helvetica' });
  addText('Building no. IX/105, Kinginimattom (PO) Palackamttom, Kolenchery', textStartX, yPos + 14, { fontSize: 6.5, color: '#e0f2fe' });
  addText('Ernakulam, Kerala - 682311', textStartX, yPos + 18, { fontSize: 6.5, color: '#e0f2fe' });
  
  // Payslip title and date (right)
  addText('PAYSLIP', pageWidth - margin - 3, yPos + 9, { fontSize: 14, color: '#ffffff', align: 'right', font: 'helvetica' });
  addText(monthName + ' ' + data.year, pageWidth - margin - 3, yPos + 16, { fontSize: 10, color: '#e0f2fe', align: 'right' });
  
  yPos += 26;
  
  // GST and contact info bar
  addText('GST: 32BJZPJ4929C1Z0   |   Phone: +91-7593844590, +91-7593844592   |   www.pearldental.care', margin + 2, yPos, { fontSize: 7, color: lightText });
  yPos += 6;

  // ==================== EMPLOYEE INFO SECTION ====================
  drawRect(margin, yPos, contentWidth, 28, '#f0fdfa', borderColor);
  
  // Employee name and designation
  addText(data.employee.name.toUpperCase(), margin + 4, yPos + 7, { fontSize: 12, color: primaryColor, font: 'helvetica' });
  addText(data.employee.designation || '', margin + 4, yPos + 13, { fontSize: 9, color: lightText });
  
  // Column positions
  const col1X = margin + 4;
  const col2X = margin + 62;
  const col3X = margin + 120;
  let infoY = yPos + 19;
  
  const empNo = displayValue(data.employee.emp_no);
  const department = displayValue(data.employee.department);
  const dateJoined = displayValue(data.employee.date_joined);
  const paymentMode = displayValue(data.employee.payment_mode);
  const bankName = displayValue(data.employee.bank_name);
  const bankAccount = displayValue(data.employee.bank_account);
  const pan = displayValue(data.employee.pan);
  const uan = displayValue(data.employee.uan);
  
  // Row 1
  if (empNo) {
    addText('Emp ID:', col1X, infoY, { fontSize: 7, color: lightText });
    addText(empNo, col1X + 14, infoY, { fontSize: 8, color: darkText });
  }
  if (department) {
    addText('Dept:', col2X, infoY, { fontSize: 7, color: lightText });
    addText(department, col2X + 12, infoY, { fontSize: 8, color: darkText });
  }
  if (dateJoined) {
    addText('Joined:', col3X, infoY, { fontSize: 7, color: lightText });
    addText(dateJoined, col3X + 14, infoY, { fontSize: 8, color: darkText });
  }
  
  infoY += 5;
  
  // Row 2
  if (paymentMode) {
    addText('Payment:', col1X, infoY, { fontSize: 7, color: lightText });
    addText(paymentMode, col1X + 16, infoY, { fontSize: 8, color: darkText });
  }
  if (bankName) {
    addText('Bank:', col2X, infoY, { fontSize: 7, color: lightText });
    addText(bankName, col2X + 12, infoY, { fontSize: 8, color: darkText });
  }
  if (bankAccount) {
    addText('A/C:', col3X, infoY, { fontSize: 7, color: lightText });
    addText(maskAccountNumber(bankAccount), col3X + 10, infoY, { fontSize: 8, color: darkText });
  }
  
  infoY += 5;
  
  // Row 3
  if (pan) {
    addText('PAN:', col1X, infoY, { fontSize: 7, color: lightText });
    addText(pan, col1X + 10, infoY, { fontSize: 8, color: darkText });
  }
  if (uan) {
    addText('UAN:', col2X, infoY, { fontSize: 7, color: lightText });
    addText(uan, col2X + 12, infoY, { fontSize: 8, color: darkText });
  }
  
  yPos += 30;

  // ==================== ATTENDANCE & PAY SUMMARY ====================
  drawRect(margin, yPos, contentWidth, 11, '#fff7ed', borderColor);
  
  const summaryItems = [
    { label: 'Period', value: monthName + ' ' + data.year },
    { label: 'Working Days', value: data.attendance.maxWorkableDays.toString() },
    { label: 'Present', value: data.attendance.actualDaysWorked.toString() },
    { label: 'LOP', value: data.attendance.lossOfPayDays.toString() }
  ];
  
  const summaryWidth = contentWidth / 4;
  summaryItems.forEach((item, index) => {
    const itemX = margin + (index * summaryWidth) + 4;
    addText(item.label + ':', itemX, yPos + 4, { fontSize: 7, color: lightText });
    addText(item.value, itemX, yPos + 8.5, { fontSize: 9, color: darkText });
  });
  
  yPos += 13;

  // ==================== EARNINGS & DEDUCTIONS TABLE ====================
  const colWidth = (contentWidth - 2) / 2; // 2mm gap in middle
  const rowHeight = 7;
  const centerX = margin + colWidth + 1; // Center divider line
  
  // Headers
  drawRect(margin, yPos, colWidth, rowHeight, primaryColor);
  drawRect(centerX + 1, yPos, colWidth, rowHeight, secondaryColor);
  
  addText('EARNINGS', margin + colWidth / 2, yPos + 5, { fontSize: 9, color: '#ffffff', align: 'center', font: 'helvetica' });
  addText('DEDUCTIONS', centerX + 1 + colWidth / 2, yPos + 5, { fontSize: 9, color: '#ffffff', align: 'center', font: 'helvetica' });
  
  yPos += rowHeight;
  
  // Vertical divider line
  doc.setDrawColor(borderColor);
  doc.setLineWidth(0.5);
  doc.line(centerX, yPos - rowHeight, centerX, yPos + (rowHeight * 8));
  
  // Calculate max rows needed
  const maxRows = Math.max(data.salary.earnings.length, data.salary.deductions.length);
  
  for (let i = 0; i < maxRows; i++) {
    const isEven = i % 2 === 0;
    const bgColor = isEven ? '#ffffff' : '#f8fafc';
    
    // Earnings row
    if (i < data.salary.earnings.length) {
      drawRect(margin, yPos, colWidth, rowHeight, bgColor);
      const earnName = truncateText(data.salary.earnings[i].name, 50, 8, doc);
      addText(earnName, margin + 3, yPos + 5, { fontSize: 8, color: darkText });
      addText(formatCurrency(data.salary.earnings[i].amount), margin + colWidth - 3, yPos + 5, { fontSize: 8, color: darkText, align: 'right' });
    } else {
      drawRect(margin, yPos, colWidth, rowHeight, bgColor);
    }
    
    // Deductions row
    if (i < data.salary.deductions.length) {
      drawRect(centerX + 1, yPos, colWidth, rowHeight, bgColor);
      const dedName = truncateText(data.salary.deductions[i].name, 50, 8, doc);
      addText(dedName, centerX + 4, yPos + 5, { fontSize: 8, color: darkText });
      addText(formatCurrency(data.salary.deductions[i].amount), centerX + colWidth - 3, yPos + 5, { fontSize: 8, color: darkText, align: 'right' });
    } else {
      drawRect(centerX + 1, yPos, colWidth, rowHeight, bgColor);
    }
    
    yPos += rowHeight;
  }
  
  // Totals row
  drawRect(margin, yPos, colWidth, rowHeight, '#e0f2fe');
  drawRect(centerX + 1, yPos, colWidth, rowHeight, '#fee2e2');
  
  addText('Total Earnings', margin + 3, yPos + 5, { fontSize: 8, color: primaryColor, font: 'helvetica' });
  addText(formatCurrency(data.salary.totalEarnings), margin + colWidth - 3, yPos + 5, { fontSize: 8, color: primaryColor, align: 'right', font: 'helvetica' });

  addText('Total Deductions', centerX + 4, yPos + 5, { fontSize: 8, color: secondaryColor, font: 'helvetica' });
  addText(formatCurrency(data.salary.totalDeductions), centerX + colWidth - 3, yPos + 5, { fontSize: 8, color: secondaryColor, align: 'right', font: 'helvetica' });
  
  yPos += rowHeight + 4;

  // ==================== NET PAY SECTION ====================
  const netPayHeight = 20;
  drawRect(margin, yPos, contentWidth, netPayHeight, '#f0fdfa', primaryColor);
  
  addText('NET SALARY PAYABLE', margin + 5, yPos + 6, { fontSize: 9, color: lightText });
  addText(formatCurrency(data.salary.netPay), pageWidth - margin - 5, yPos + 8, { fontSize: 16, color: primaryColor, align: 'right', font: 'helvetica' });

  const amountWords = numberToWords(data.salary.netPay);
  addText(amountWords, margin + 5, yPos + 15, { fontSize: 9, color: darkText });
  
  yPos += netPayHeight + 6;

  // ==================== FOOTER ====================
  const footerY = 275;
  
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);
  
  addText('This is a computer generated payslip and does not require signature.', pageWidth / 2, footerY + 2, { fontSize: 7, color: lightText, align: 'center' });
  
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  addText('Generated on: ' + today + '   |   www.pearldental.care', pageWidth / 2, footerY + 7, { fontSize: 7, color: lightText, align: 'center' });

  return doc.output('dataurlstring');
}

// Generate and download PDF
export async function downloadPayslip(data: PayslipData, filename?: string): Promise<void> {
  const pdfDataUrl = await generatePayslipPDF(data);
  
  const link = document.createElement('a');
  link.href = pdfDataUrl;
  link.download = filename || 'Payslip_' + data.employee.name + '_' + data.month + '_' + data.year + '.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default {
  generatePayslipPDF,
  downloadPayslip
};