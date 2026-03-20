# Pearl Dental Payroll Super User Dashboard
## Design Specification Document

> **Design Philosophy**: Premium SaaS aesthetic — Apple meets Stripe meets Linear — but for payroll. Sophisticated, trustworthy, award-worthy.

---

## 1. Visual Design System

### 1.1 Color Palette

#### Primary Dark Theme (Default)

```css
/* Background Layers - Depth System */
--bg-base: #0a0a0f;           /* Deepest background */
--bg-surface: #12121a;        /* Card backgrounds */
--bg-elevated: #1a1a24;       /* Elevated cards, modals */
--bg-overlay: #22222e;        /* Hover states, overlays */

/* Primary Accent - Pearl White (Dental Premium) */
--accent-primary: #f0f0f5;    /* Primary text, headings */
--accent-secondary: #a0a0b0;  /* Secondary text, muted */

/* Brand Colors - Pearl Gradient */
--pearl-start: #e8e8f0;       /* Pearl white gradient start */
--pearl-end: #d0d0e0;         /* Pearl white gradient end */
--pearl-glow: rgba(232, 232, 240, 0.15); /* Subtle glow effect */

/* Semantic Colors */
--success: #22c55e;           /* Emerald 500 */
--success-muted: rgba(34, 197, 94, 0.15);
--warning: #f59e0b;           /* Amber 500 */
--warning-muted: rgba(245, 158, 11, 0.15);
--danger: #ef4444;            /* Red 500 */
--danger-muted: rgba(239, 68, 68, 0.15);
--info: #3b82f6;              /* Blue 500 */
--info-muted: rgba(59, 130, 246, 0.15);

/* Chart Colors - Vibrant yet sophisticated */
--chart-1: #6366f1;           /* Indigo 500 */
--chart-2: #8b5cf6;           /* Violet 500 */
--chart-3: #06b6d4;           /* Cyan 500 */
--chart-4: #10b981;           /* Emerald 500 */
--chart-5: #f59e0b;           /* Amber 500 */
--chart-6: #ec4899;           /* Pink 500 */
--chart-7: #f97316;           /* Orange 500 */
--chart-8: #14b8a6;           /* Teal 500 */

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.03);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

/* Gradients */
--gradient-pearl: linear-gradient(135deg, var(--pearl-start), var(--pearl-end));
--gradient-accent: linear-gradient(135deg, #6366f1, #8b5cf6);
--gradient-success: linear-gradient(135deg, #10b981, #14b8a6);
--gradient-danger: linear-gradient(135deg, #ef4444, #f97316);
```

#### Light Theme (Optional)

```css
/* Background Layers */
--bg-base: #fafafa;
--bg-surface: #ffffff;
--bg-elevated: #f5f5f7;
--bg-overlay: #ebebf0;

/* Text */
--accent-primary: #1a1a1f;
--accent-secondary: #6b7280;

/* Glassmorphism Light */
--glass-bg: rgba(255, 255, 255, 0.7);
--glass-border: rgba(0, 0, 0, 0.08);
```

### 1.2 Typography

```css
/* Font Stack */
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;

/* Type Scale - Major Third (1.25) */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.2;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;

/* Letter Spacing */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;

/* Number Formatting */
--tabular-nums: tabular-nums;
```

#### Typography Hierarchy

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| **Page Title** | 2.25rem (36px) | 700 | 1.2 | -0.025em |
| **Section Header** | 1.5rem (24px) | 600 | 1.3 | -0.025em |
| **Card Title** | 1.125rem (18px) | 600 | 1.4 | 0 |
| **KPI Value** | 2.25rem (36px) | 700 | 1 | tabular-nums |
| **KPI Label** | 0.875rem (14px) | 500 | 1.4 | 0.025em |
| **Body Text** | 0.875rem (14px) | 400 | 1.5 | 0 |
| **Caption** | 0.75rem (12px) | 400 | 1.5 | 0.025em |
| **Table Header** | 0.75rem (12px) | 600 | 1 | 0.1em uppercase |
| **Table Cell** | 0.875rem (14px) | 400 | 1.5 | 0 |

### 1.3 Spacing System

```css
/* Base Unit: 4px */
--space-0: 0;
--space-0.5: 0.125rem;  /* 2px */
--space-1: 0.25rem;      /* 4px */
--space-1.5: 0.375rem;   /* 6px */
--space-2: 0.5rem;        /* 8px */
--space-2.5: 0.625rem;   /* 10px */
--space-3: 0.75rem;      /* 12px */
--space-3.5: 0.875rem;   /* 14px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px */
--space-7: 1.75rem;      /* 28px */
--space-8: 2rem;         /* 32px */
--space-9: 2.25rem;      /* 36px */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-14: 3.5rem;      /* 56px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
--space-24: 6rem;        /* 96px */
```

### 1.4 Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;     /* 4px - subtle rounding */
--radius-md: 0.5rem;      /* 8px - buttons, inputs */
--radius-lg: 0.75rem;     /* 12px - cards */
--radius-xl: 1rem;        /* 16px - large cards */
--radius-2xl: 1.5rem;     /* 24px - modals */
--radius-full: 9999px;    /* Pills, avatars */
```

### 1.5 Shadows & Elevation

```css
/* Elevation System */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.3);
--shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.3);
--shadow-2xl: 0 24px 48px rgba(0, 0, 0, 0.4);

/* Glow Effects */
--glow-primary: 0 0 20px rgba(99, 102, 241, 0.3);
--glow-success: 0 0 20px rgba(34, 197, 94, 0.3);
--glow-danger: 0 0 20px rgba(239, 68, 68, 0.3);
--glow-pearl: 0 0 40px rgba(232, 232, 240, 0.1);

/* Inset Shadows */
--shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.3);
```

---

## 2. Animation & Motion System

### 2.1 Timing Functions

```css
/* Custom Easings - Spring Physics Inspired */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-in-out-spring: cubic-bezier(0.5, 0, 0.1, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Durations */
--duration-instant: 50ms;
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
--duration-slower: 600ms;
```

### 2.2 Animation Presets

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Slide Up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide In from Right */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Pulse Glow */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 var(--glow-primary); }
  50% { box-shadow: 0 0 20px 5px var(--glow-primary); }
}

/* Shimmer (Loading) */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Number Count Up */
@keyframes countUp {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 2.3 Micro-Interactions

```css
/* Button Hover */
.btn-primary {
  transition: all var(--duration-fast) var(--ease-out-expo);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--glow-primary);
}

/* Card Hover */
.card-interactive {
  transition: all var(--duration-normal) var(--ease-out-expo);
}
.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(99, 102, 241, 0.3);
}

/* KPI Card Glow on Hover */
.kpi-card {
  position: relative;
  overflow: hidden;
}
.kpi-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(99, 102, 241, 0.05));
  opacity: 0;
  transition: opacity var(--duration-normal);
}
.kpi-card:hover::before {
  opacity: 1;
}

/* Tab Indicator */
.tab-indicator {
  transition: all var(--duration-normal) var(--ease-out-expo);
}

/* Chart Entry Animation */
.chart-bar {
  animation: growUp var(--duration-slow) var(--ease-out-expo) forwards;
  transform-origin: bottom;
}

@keyframes growUp {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
```

---

## 3. Layout System

### 3.1 Grid System

```css
/* Container */
.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Main Grid - 12 Column */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}

/* Dashboard Layout */
.dashboard-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

/* Sidebar + Content */
.main-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
}

/* Content Area */
.content-area {
  padding: var(--space-8);
  overflow-y: auto;
  max-height: calc(100vh - 64px);
}
```

### 3.2 Responsive Breakpoints

```css
/* Mobile First Approach */
/* xs: 0 - 639px */
/* sm: 640px - 767px */
/* md: 768px - 1023px */
/* lg: 1024px - 1279px */
/* xl: 1280px - 1535px */
/* 2xl: 1536px+ */

/* Dashboard Specific */
@media (max-width: 1023px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: fixed;
    left: -280px;
    transition: left var(--duration-normal) var(--ease-out-expo);
  }
  .sidebar.open {
    left: 0;
  }
}

@media (max-width: 767px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  .chart-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .chart-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .kpi-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .chart-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 3.3 Component Spacing Guidelines

| Component | Padding | Gap | Margin Bottom |
|-----------|---------|-----|---------------|
| **Page Header** | 24px | 16px | 32px |
| **Section** | 24px | 24px | 24px |
| **Card** | 20px | 16px | - |
| **KPI Card** | 24px | 12px | - |
| **Table Row** | 16px | - | - |
| **Form Group** | 16px | 8px | 16px |
| **Button Group** | - | 12px | - |

---

## 4. Component Architecture

### 4.1 File Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx          # Main layout wrapper
│   │   ├── DashboardSidebar.tsx         # Navigation sidebar
│   │   ├── DashboardHeader.tsx          # Top header with actions
│   │   ├── PeriodSelector.tsx           # Month/Year picker
│   │   │
│   │   ├── overview/
│   │   │   ├── OverviewTab.tsx          # Overview tab container
│   │   │   ├── KPICardsRow.tsx           # Row of KPI cards
│   │   │   ├── KPICard.tsx               # Individual KPI card
│   │   │   ├── TrendChart.tsx           # Monthly trend line chart
│   │   │   ├── AlertsPanel.tsx           # Insights and alerts
│   │   │   └── QuickActions.tsx          # Quick action buttons
│   │   │
│   │   ├── employees/
│   │   │   ├── EmployeesTab.tsx         # Employee analytics container
│   │   │   ├── HeadcountWidget.tsx      # Headcount with trend
│   │   │   ├── DistributionChart.tsx    # Department/Role donut
│   │   │   ├── SalaryHistogram.tsx      # Salary distribution
│   │   │   ├── TenureAnalysis.tsx       # Tenure breakdown
│   │   │   └── EmployeeTable.tsx       # Sortable employee list
│   │   │
│   │   ├── payroll/
│   │   │   ├── PayrollTab.tsx           # Payroll insights container
│   │   │   ├── CostBreakdown.tsx        # Earnings/Deductions breakdown
│   │   │   ├── WaterfallChart.tsx       # Gross → Net waterfall
│   │   │   ├── DepartmentCost.tsx       # Department cost comparison
│   │   │   └── PayrollTable.tsx         # Detailed payroll data
│   │   │
│   │   ├── attendance/
│   │   │   ├── AttendanceTab.tsx        # Attendance analytics container
│   │   │   ├── AttendanceGauge.tsx      # Circular gauge chart
│   │   │   ├── AttendanceHeatmap.tsx    # 12-month heatmap
│   │   │   ├── LOPAnalysis.tsx          # Loss of Pay analysis
│   │   │   └── IndividualAttendance.tsx # Per-employee tracking
│   │   │
│   │   └── shared/
│   │       ├── Card.tsx                 # Base card component
│   │       ├── ChartContainer.tsx       # Chart wrapper with title
│   │       ├── DataTable.tsx            # Reusable table
│   │       ├── EmptyState.tsx           # No data placeholder
│   │       ├── LoadingSkeleton.tsx      # Loading states
│   │       ├── TrendIndicator.tsx       # Up/Down arrow with %
│   │       ├── Badge.tsx                # Status badges
│   │       ├── Button.tsx               # Button variants
│   │       ├── Select.tsx               # Custom select
│   │       └── Tooltip.tsx              # Rich tooltips
│   │
│   └── charts/
│       ├── LineChart.tsx                # Recharts line wrapper
│       ├── AreaChart.tsx                 # Area chart
│       ├── BarChart.tsx                 # Bar chart
│       ├── DonutChart.tsx               # Donut/Pie chart
│       ├── GaugeChart.tsx               # Semi-circular gauge
│       ├── HeatmapChart.tsx             # Calendar heatmap
│       └── Sparkline.tsx                # Mini sparkline
│
├── hooks/
│   ├── useDashboard.ts                  # Dashboard data fetching
│   ├── useAnalytics.ts                  # Calculation utilities
│   ├── useTheme.ts                       # Dark/Light mode
│   └── useAnimation.ts                  # Animation utilities
│
├── lib/
│   ├── dashboardUtils.ts                # Helper functions
│   ├── chartConfig.ts                   # Chart.js/Recharts config
│   ├── formatters.ts                    # Number/date formatting
│   └── constants.ts                     # Static data
│
├── styles/
│   ├── globals.css                      # Global styles
│   ├── animations.css                   # Keyframe animations
│   └── charts.css                       # Chart overrides
│
└── types/
    └── dashboard.ts                      # Dashboard-specific types
```

### 4.2 Core Component Specifications

#### DashboardLayout

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// Main wrapper with sidebar and content area
// Handles responsive sidebar toggle
// Provides theme context
```

#### KPICard

```typescript
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  prefix?: string;           // e.g., '₹', '$'
  suffix?: string;           // e.g., '%', 'days'
  trend?: {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;         // e.g., 'vs last month'
  };
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  loading?: boolean;
  sparklineData?: number[]; // Mini trend line
}

// Glassmorphism card with:
// - Animated number count-up
// - Trend indicator with color
// - Optional sparkline
// - Hover glow effect
// - Click interaction
```

#### ChartContainer

```typescript
interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;    // Export, filter buttons
  loading?: boolean;
  error?: string;
  className?: string;
}

// Wrapper with:
// - Consistent header styling
// - Loading skeleton
// - Error state
// - Action buttons area
// - Responsive sizing
```

#### TrendIndicator

```typescript
interface TrendIndicatorProps {
  value: number;
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
  label?: string;
  size?: 'sm' | 'md';
}

// Animated arrow with:
// - Color coding (green up, red down, gray neutral)
// - Percentage display
// - Optional label
// - Spring animation on mount
```

#### DataTable

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

// Premium table with:
// - Sticky headers
// - Row hover effects
// - Sort indicators
// - Filter dropdown
// - Pagination
// - Empty state
// - Loading skeleton rows
```

---

## 5. Dashboard Tab Specifications

### 5.1 Overview Tab

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Dashboard Overview                           [Mar 2026 ▼] [⏎]   │   │
│  │ Real-time payroll analytics and insights                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  KPI CARDS ROW                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ Total       │ │ Monthly     │ │ Avg Days    │ │ Payslips    │      │
│  │ Employees   │ │ Payroll     │ │ Worked      │ │ Generated   │      │
│  │             │ │             │ │             │ │             │      │
│  │    8        │ │  ₹2.39L     │ │    24.5     │ │     8       │      │
│  │  ↑ 0%       │ │  ↑ 5.2%     │ │  ↓ 2.1%     │ │  ---        │      │
│  │  vs last    │ │  vs last    │ │  vs last    │ │  this month │      │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │
├─────────────────────────────────────────────────────────────────────────┤
│  MAIN CHARTS ROW                                                        │
│  ┌───────────────────────────────────┐ ┌───────────────────────────┐   │
│  │ PAYROLL TREND (6 MONTHS)          │ │ DEPARTMENT DISTRIBUTION   │   │
│  │                                   │ │                           │   │
│  │ [Line chart with gradient fill]   │ │ [Donut chart]             │   │
│  │                                   │ │                           │   │
│  │ ₹2.5L ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─     │ │   Production: 37.5%       │   │
│  │                                   │ │   Marketing: 12.5%        │   │
│  │                                   │ │   Maintenance: 12.5%      │   │
│  │                                   │ │   CadCam: 25%             │   │
│  │                                   │ │   Dental Tech: 12.5%      │   │
│  └───────────────────────────────────┘ └───────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  BOTTOM ROW                                                             │
│  ┌───────────────────────────────────┐ ┌───────────────────────────┐   │
│  │ EARNINGS BREAKDOWN               │ │ INSIGHTS & ALERTS         │   │
│  │                                   │ │                           │   │
│  │ [Stacked bar chart]               │ │ ⚡ 2 employees with >3 LOP│   │
│  │                                   │ │ 📈 Payroll up 5.2% MoM    │   │
│  │ Basic: 45% | HRA: 22% | ...      │ │ 💰 Avg salary: ₹29,875    │   │
│  │                                   │ │ 👥 8 active employees     │   │
│  └───────────────────────────────────┘ └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- `OverviewTab.tsx` - Main container
- `KPICardsRow.tsx` - 4 KPI cards in grid
- `TrendChart.tsx` - 6-month payroll trend
- `DistributionChart.tsx` - Department donut
- `EarningsBreakdown.tsx` - Stacked bar
- `AlertsPanel.tsx` - Insights list

### 5.2 Employee Analytics Tab

```
┌─────────────────────────────────────────────────────────────────────────┐
│  EMPLOYEE OVERVIEW CARDS                                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ Total       │ │ New Hires   │ │ Avg Tenure  │ │ Avg Salary  │       │
│  │    8        │ │    0        │ │  1.5 yrs    │ │  ₹29,875    │       │
│  │  Active     │ │  This Month │ │             │ │             │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────────────────────────────────────┤
│  DISTRIBUTION CHARTS                                                     │
│  ┌───────────────────────────────────┐ ┌───────────────────────────┐   │
│  │ DESIGNATION DISTRIBUTION          │ │ SALARY BRACKETS           │   │
│  │                                   │ │                           │   │
│  │ [Horizontal bar chart]            │ │ [Histogram]                │   │
│  │                                   │ │                           │   │
│  │ Production Head    ████ 1         │ │ ₹0-15K    ██ 2            │   │
│  │ Marketing Head     ████ 1         │ │ ₹15-25K   █  1            │   │
│  │ Maintenance Head   ████ 1         │ │ ₹25-50K   ████ 5          │   │
│  │ CadCam Technician  ████████ 2     │ │ ₹50K+     0               │   │
│  │ Dental Technician  ████████████ 3│ │                           │   │
│  └───────────────────────────────────┘ └───────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  EMPLOYEE DIRECTORY                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [Search...] [Filter ▼] [Sort ▼]              [Export] [Add]     │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │ Name          │ Designation    │ Department │ Salary  │ Status  │   │
│  │ ─────────────┼────────────────┼────────────┼─────────┼─────────│   │
│  │ Tinkle       │ Production Head│ Production │ ₹50,000 │ Active  │   │
│  │ Jomon        │ Marketing Head │ Marketing  │ ₹50,000 │ Active  │   │
│  │ ...          │ ...            │ ...        │ ...     │ ...     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- `EmployeesTab.tsx` - Main container
- `HeadcountWidget.tsx` - Employee count with mini chart
- `DistributionChart.tsx` - Horizontal bar for designations
- `SalaryHistogram.tsx` - Salary bracket distribution
- `EmployeeTable.tsx` - Sortable/filterable table

### 5.3 Payroll Insights Tab

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PAYROLL SUMMARY CARDS                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ Total Gross │ │ Total       │ │ Net Pay     │ │ Deductions  │       │
│  │   ₹2.39L    │ │ Earnings    │ │   ₹2.15L    │ │   ₹24K      │       │
│  │             │ │   ₹2.39L    │ │             │ │             │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────────────────────────────────────┤
│  WATERFALL CHART                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ GROSS → DEDUCTIONS → NET PAY FLOW                               │   │
│  │                                                                  │   │
│  │ [Waterfall chart showing salary flow]                           │   │
│  │                                                                  │   │
│  │ Gross ₹2.39L → PF ₹-3K → Tax ₹-X → Net ₹2.15L                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  BREAKDOWN CHARTS                                                        │
│  ┌───────────────────────────────────┐ ┌───────────────────────────┐   │
│  │ EARNINGS BREAKDOWN                │ │ DEDUCTIONS BREAKDOWN       │   │
│  │                                   │ │                           │   │
│  │ [Stacked horizontal bar]          │ │ [Stacked horizontal bar]   │   │
│  │                                   │ │                           │   │
│  │ Basic Salary      ████████ 45%   │ │ PF Employee    ████ 60%   │   │
│  │ HRA               ████ 22%       │ │ Prof Tax       ██ 25%     │   │
│  │ Conveyance        ██ 5%          │ │ Insurance      █ 10%       │   │
│  │ Medical           ██ 5%          │ │ Income Tax     █ 5%        │   │
│  │ Special Allow.    ████████ 23%   │ │                           │   │
│  └───────────────────────────────────┘ └───────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  DEPARTMENT COST COMPARISON                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [Grouped bar chart - Avg salary by department]                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- `PayrollTab.tsx` - Main container
- `CostBreakdown.tsx` - Earnings/Deductions cards
- `WaterfallChart.tsx` - Salary flow visualization
- `DepartmentCost.tsx` - Department comparison
- `PayrollTable.tsx` - Detailed breakdown table

### 5.4 Attendance Analytics Tab

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ATTENDANCE SUMMARY CARDS                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ Attendance  │ │ Avg Days    │ │ Perfect     │ │ Total LOP   │       │
│  │ Rate        │ │ Worked      │ │ Attendance  │ │ Days        │       │
│  │   94.2%    │ │   24.5      │ │    5        │ │    12       │       │
│  │            │ │             │ │ employees   │ │ days        │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────────────────────────────────────┤
│  ATTENDANCE GAUGE                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ OVERALL ATTENDANCE RATE                                         │   │
│  │                                                                  │   │
│  │ [Semi-circular gauge chart - 94.2%]                            │   │
│  │                                                                  │   │
│  │ Excellent: 95-100% | Good: 85-94% | Avg: 75-84% | Poor: <75%  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  ATTENDANCE HEATMAP                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 12-MONTH ATTENDANCE HEATMAP                                     │   │
│  │                                                                  │   │
│  │ Employee  │ Jan │ Feb │ Mar │ Apr │ May │ Jun │ ...          │   │
│  │ ─────────┼─────┼─────┼─────┼─────┼─────┼─────┼───            │   │
│  │ Tinkle   │ 26  │ 25  │ 26  │ 26  │ 24  │ 26  │ ...           │   │
│  │ Jomon    │ 24  │ 26  │ 25  │ 26  │ 26  │ 25  │ ...           │   │
│  │ ...      │ ... │ ... │ ... │ ... │ ... │ ... │               │   │
│  │                                                                  │   │
│  │ [Color scale: Red (low) → Yellow → Green (high)]              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│  INDIVIDUAL TRACKING                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ DAYS WORKED THIS MONTH                                          │   │
│  │                                                                  │   │
│  │ [Horizontal bar chart - each employee]                          │   │
│  │                                                                  │   │
│  │ Tinkle    ████████████████████████████████████ 26/26           │   │
│  │ Jomon     ██████████████████████████████████ 24/26            │   │
│  │ Jacob     ████████████████████████████████████ 26/26           │   │
│  │ ...                                                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- `AttendanceTab.tsx` - Main container
- `AttendanceGauge.tsx` - Semi-circular gauge
- `AttendanceHeatmap.tsx` - 12-month grid
- `IndividualAttendance.tsx` - Per-employee bars
- `LOPAnalysis.tsx` - Loss of Pay breakdown

---

## 6. Interaction Design

### 6.1 Hover States

```css
/* KPI Card Hover */
.kpi-card {
  background: var(--bg-surface);
  border: 1px solid var(--glass-border);
  transition: all var(--duration-normal) var(--ease-out-expo);
}

.kpi-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: var(--shadow-xl), 0 0 40px rgba(99, 102, 241, 0.1);
}

/* Chart Container Hover */
.chart-container {
  background: var(--bg-surface);
  border: 1px solid var(--glass-border);
}

.chart-container:hover {
  border-color: rgba(99, 102, 241, 0.2);
}

/* Table Row Hover */
.table-row {
  transition: background var(--duration-fast);
}

.table-row:hover {
  background: rgba(99, 102, 241, 0.05);
}

/* Button Hover */
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  transition: all var(--duration-fast) var(--ease-out-expo);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

/* Sidebar Nav Item Hover */
.nav-item {
  transition: all var(--duration-fast);
}

.nav-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  border-left: 3px solid var(--chart-1);
}
```

### 6.2 Focus States (Accessibility)

```css
/* Focus Ring */
:focus-visible {
  outline: 2px solid var(--chart-1);
  outline-offset: 2px;
}

/* Button Focus */
.btn:focus-visible {
  outline: 2px solid var(--chart-1);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

/* Input Focus */
input:focus-visible,
select:focus-visible {
  outline: none;
  border-color: var(--chart-1);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}
```

### 6.3 Loading States

```css
/* Skeleton Animation */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    var(--bg-surface) 50%,
    var(--bg-elevated) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* KPI Card Skeleton */
.kpi-skeleton {
  height: 120px;
  border-radius: var(--radius-xl);
}

/* Chart Skeleton */
.chart-skeleton {
  height: 300px;
  border-radius: var(--radius-lg);
}
```

### 6.4 Empty States

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Design:
// - Centered content
// - Muted icon (large)
// - Title in secondary color
// - Optional description
// - Optional CTA button
```

---

## 7. Chart Configuration

### 7.1 Recharts Theme Setup

```typescript
// chartConfig.ts
import { 
  ResponsiveContainer, 
  Tooltip, 
  CartesianGrid,
  XAxis,
  YAxis 
} from 'recharts';

export const chartTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    chart: [
      '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
      '#f59e0b', '#ec4899', '#f97316', '#14b8a6'
    ]
  },
  grid: {
    stroke: 'rgba(255, 255, 255, 0.05)',
    strokeDasharray: '4 4'
  },
  tooltip: {
    backgroundColor: '#1a1a24',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '12px 16px'
  },
  axis: {
    stroke: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    fill: '#a0a0b0'
  }
};

export const defaultChartProps = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 }
};
```

### 7.2 Chart Animations

```typescript
// Animation configuration for Recharts
export const chartAnimations = {
  // Line chart - draw path
  line: {
    duration: 800,
    easing: 'ease-out'
  },
  // Bar chart - grow up
  bar: {
    duration: 600,
    easing: 'ease-out',
    delay: (index: number) => index * 50
  },
  // Area chart - fade in
  area: {
    duration: 1000,
    easing: 'ease-out'
  },
  // Pie/Donut - scale and rotate
  pie: {
    duration: 800,
    easing: 'ease-out'
  }
};
```

---

## 8. Accessibility Guidelines

### 8.1 Color Contrast

- **Text on Dark Background**: Minimum 4.5:1 contrast ratio
- **Large Text (>18px)**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio
- **Focus Indicators**: Visible on all interactive elements

### 8.2 Keyboard Navigation

```typescript
// Tab order for dashboard
// 1. Sidebar navigation
// 2. Period selector
// 3. KPI cards (if interactive)
// 4. Chart containers (if interactive)
// 5. Data tables
// 6. Action buttons

// Escape key to close modals
// Arrow keys for table navigation
// Enter/Space for activation
```

### 8.3 Screen Reader Support

```typescript
// ARIA labels for charts
<BarChart
  role="img"
  aria-label="Monthly payroll trend for the last 6 months"
>
  {/* Chart content */}
</BarChart>

// Data table accessibility
<table
  role="table"
  aria-label="Employee directory"
>
  <caption className="sr-only">
    List of all employees with their designation and salary
  </caption>
  {/* Table content */}
</table>

// KPI Card accessibility
<KPICard
  aria-label={`${title}: ${formattedValue}`}
  role="article"
>
  {/* Card content */}
</KPICard>
```

### 8.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Performance Considerations

### 9.1 Code Splitting

```typescript
// Lazy load dashboard tabs
const OverviewTab = lazy(() => import('./overview/OverviewTab'));
const EmployeesTab = lazy(() => import('./employees/EmployeesTab'));
const PayrollTab = lazy(() => import('./payroll/PayrollTab'));
const AttendanceTab = lazy(() => import('./attendance/AttendanceTab'));

// Lazy load chart components
const LineChart = lazy(() => import('@/components/charts/LineChart'));
const DonutChart = lazy(() => import('@/components/charts/DonutChart'));
```

### 9.2 Memoization

```typescript
// Memoize expensive calculations
const payrollStats = useMemo(() => {
  return calculatePayrollStats(employees, history);
}, [employees, history]);

// Memoize chart data transformations
const chartData = useMemo(() => {
  return transformDataForChart(rawData);
}, [rawData]);

// Use callback for event handlers
const handleTabChange = useCallback((tab: TabId) => {
  setActiveTab(tab);
}, []);
```

### 9.3 Virtual Scrolling

```typescript
// For large employee tables
import { useVirtualizer } from '@tanstack/react-virtual';

// Implement virtual scrolling for tables > 50 rows
```

---

## 10. Implementation Checklist

### Phase 1: Foundation
- [ ] Create design system CSS variables
- [ ] Set up Tailwind theme extension
- [ ] Create base Card component
- [ ] Create Button component variants
- [ ] Create LoadingSkeleton component
- [ ] Set up dark theme as default

### Phase 2: Layout
- [ ] Create DashboardLayout component
- [ ] Create DashboardSidebar component
- [ ] Create DashboardHeader component
- [ ] Create PeriodSelector component
- [ ] Implement responsive grid system

### Phase 3: KPI Cards
- [ ] Create KPICard component
- [ ] Create TrendIndicator component
- [ ] Create KPICardsRow component
- [ ] Add number count-up animation
- [ ] Add sparkline mini charts

### Phase 4: Charts
- [ ] Configure Recharts theme
- [ ] Create LineChart wrapper
- [ ] Create DonutChart wrapper
- [ ] Create BarChart wrapper
- [ ] Create GaugeChart component
- [ ] Create HeatmapChart component
- [ ] Add chart animations

### Phase 5: Overview Tab
- [ ] Create OverviewTab container
- [ ] Implement TrendChart (6-month)
- [ ] Implement DistributionChart
- [ ] Implement EarningsBreakdown
- [ ] Implement AlertsPanel

### Phase 6: Employee Analytics
- [ ] Create EmployeesTab container
- [ ] Implement DistributionChart (designation)
- [ ] Implement SalaryHistogram
- [ ] Implement EmployeeTable
- [ ] Add filtering and sorting

### Phase 7: Payroll Insights
- [ ] Create PayrollTab container
- [ ] Implement CostBreakdown
- [ ] Implement WaterfallChart
- [ ] Implement DepartmentCost comparison
- [ ] Implement PayrollTable

### Phase 8: Attendance Analytics
- [ ] Create AttendanceTab container
- [ ] Implement AttendanceGauge
- [ ] Implement AttendanceHeatmap
- [ ] Implement IndividualAttendance bars
- [ ] Implement LOPAnalysis

### Phase 9: Polish
- [ ] Add micro-interactions
- [ ] Add hover effects
- [ ] Add loading states
- [ ] Add empty states
- [ ] Add error states
- [ ] Optimize animations
- [ ] Test accessibility
- [ ] Test responsiveness

---

## 11. CSS Utility Classes

```css
/* Glassmorphism */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
}

.glass-elevated {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Gradient Text */
.gradient-text {
  background: var(--gradient-pearl);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glow Effects */
.glow-primary {
  box-shadow: var(--glow-primary);
}

.glow-success {
  box-shadow: var(--glow-success);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out-expo);
}

.animate-slide-up {
  animation: slideUp var(--duration-normal) var(--ease-out-expo);
}

.animate-scale-in {
  animation: scaleIn var(--duration-fast) var(--ease-out-back);
}

/* Number Animation */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-base);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-elevated);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--bg-overlay);
}
```

---

## 12. Design Tokens Summary

```typescript
// tokens.ts - Design tokens for TypeScript
export const tokens = {
  colors: {
    bg: {
      base: '#0a0a0f',
      surface: '#12121a',
      elevated: '#1a1a24',
      overlay: '#22222e',
    },
    text: {
      primary: '#f0f0f5',
      secondary: '#a0a0b0',
      muted: '#6b6b7b',
    },
    accent: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
    chart: [
      '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
      '#f59e0b', '#ec4899', '#f97316', '#14b8a6'
    ],
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  typography: {
    fontFamily: {
      display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', monospace",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
    easing: {
      expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      spring: 'cubic-bezier(0.5, 0, 0.1, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};
```

---

## Document Information

- **Version**: 1.0
- **Created**: 2024
- **System**: Pearl Dental Payroll System
- **Target**: Super User Dashboard
- **Design Philosophy**: Awwwards-worthy, premium SaaS aesthetic

---

*This design specification provides a comprehensive foundation for building a world-class, award-worthy dashboard that balances aesthetics with functionality, performance, and accessibility.*