import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  CalendarClock,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DashboardTab } from '@/types/dashboard';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const tabs: { id: DashboardTab; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: <LayoutDashboard className="w-5 h-5" />, 
    description: 'Dashboard overview and insights' 
  },
  { 
    id: 'employees', 
    label: 'Employees', 
    icon: <Users className="w-5 h-5" />, 
    description: 'Employee analytics and metrics' 
  },
  { 
    id: 'payroll', 
    label: 'Payroll', 
    icon: <Wallet className="w-5 h-5" />, 
    description: 'Payroll insights and breakdowns' 
  },
  { 
    id: 'attendance', 
    label: 'Attendance', 
    icon: <CalendarClock className="w-5 h-5" />, 
    description: 'Attendance tracking and analytics' 
  }
];

export function DashboardSidebar({ 
  activeTab, 
  onTabChange,
  collapsed = false,
  onToggleCollapse
}: DashboardSidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold gradient-text">Pearl Dental</h1>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Admin Dashboard</p>
            </div>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="mb-6">
          {!collapsed && (
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
              Analytics
            </p>
          )}
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={`nav-item w-full ${activeTab === tab.id ? 'active' : ''}`}
                  title={collapsed ? tab.label : undefined}
                >
                  <span className="flex-shrink-0">{tab.icon}</span>
                  {!collapsed && (
                    <span className="flex-1 text-left">{tab.label}</span>
                  )}
                  {activeTab === tab.id && !collapsed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto pt-4 border-t border-[var(--glass-border)]">
          <button
            className="nav-item w-full"
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>
        </div>
      </nav>
      
      {!collapsed && (
        <div className="p-4 border-t border-[var(--glass-border)]">
          <div className="bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 rounded-xl p-4 border border-[var(--accent-primary)]/20">
            <p className="text-xs font-medium text-[var(--text-primary)] mb-1">Need Help?</p>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Check our documentation for guidance
            </p>
            <button className="w-full px-3 py-1.5 text-xs font-medium bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors">
              View Docs
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

export default DashboardSidebar;
