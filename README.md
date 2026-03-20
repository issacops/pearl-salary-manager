<div align="center">
  <h1>🦷 Pearl Dental Payroll</h1>
  <p><strong>Pearl Dental Solutions - Salary & Payroll Management System</strong></p>
  <p>A modern, client-side payroll management system for dental clinics</p>
  
  ![React](https://img.shields.io/badge/React-19-blue)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-cyan)
  ![Vercel](https://img.shields.io/badge/Vercel-Ready-black)
</div>

---

## ✨ Features

- **Employee Management** - Add, edit, and delete employee records with comprehensive salary structures
- **Payroll Processing** - Generate monthly payroll with multiple calculation methods
- **PDF Payslips** - Professional, downloadable payslip PDFs generated client-side
- **History Tracking** - Complete payroll history with search and filter capabilities
- **Company Settings** - Customizable company branding for payslips
- **Data Backup** - Export/import functionality for data portability
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pearl-dental-salary-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📦 Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 6
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## 🗂️ Project Structure

```
pearl-dental-salary-system/
├── src/
│   ├── lib/              # Utility functions
│   │   ├── store.ts      # localStorage data persistence
│   │   ├── payroll.ts   # Payroll calculations
│   │   └── pdf.ts        # PDF generation
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── vercel.json           # Vercel deployment config
└── package.json          # Dependencies and scripts
```

## 🚢 Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework

3. **Configure Project**
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Environment Variables (Optional)

In Vercel dashboard, add environment variables if needed:
- `VITE_APP_NAME` - Custom app name
- `VITE_ENABLE_ANALYTICS` - Enable analytics

## 💾 Data Storage

This application uses **client-side localStorage** for data persistence:

- **Pros**: No server required, works offline, instant data access
- **Cons**: Data is browser-specific, limited storage (5-10MB)
- **Backup**: Use the built-in Export/Import feature in Settings

> **Note**: For production with multiple users or larger data, consider adding a backend API.

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js` or use CSS variables in `src/index.css`:

```css
:root {
  --primary: #4f46e5;      /* Indigo */
  --secondary: #0ea5e9;    /* Sky */
  --accent: #10b981;       /* Emerald */
}
```

### Adding New Fields

1. Update types in `src/types/index.ts`
2. Add form fields in `EmployeeModal` component
3. Update PDF template in `src/lib/pdf.ts`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security

- All data stored locally in browser
- No external API calls for data
- HTTPS enforced on Vercel
- CSP headers configured in `vercel.json`

## 📄 License

MIT License - See LICENSE file for details

---

<div align="center">
  <p>Built with ❤️ for Pearl Dental Solutions</p>
  <p>© 2024 All rights reserved</p>
</div>
