/**
 * Pearl Dental Dashboard - Design Tokens
 * Premium SaaS aesthetic - Awwwards-worthy design system
 */

export const tokens = {
  colors: {
    // Background layers
    bg: {
      base: '#0a0a0f',
      surface: '#12121a',
      elevated: '#1a1a24',
      overlay: '#22222e',
      hover: '#2a2a36',
    },
    // Text colors
    text: {
      primary: '#f0f0f5',
      secondary: '#a0a0b0',
      muted: '#6b6b7b',
      inverse: '#0a0a0f',
    },
    // Brand colors
    brand: {
      pearlStart: '#e8e8f0',
      pearlEnd: '#d0d0e0',
      pearlGlow: 'rgba(232, 232, 240, 0.15)',
    },
    // Accent colors
    accent: {
      primary: '#6366f1',
      primaryHover: '#818cf8',
      secondary: '#8b5cf6',
      tertiary: '#06b6d4',
    },
    // Semantic colors
    semantic: {
      success: '#22c55e',
      successMuted: 'rgba(34, 197, 94, 0.15)',
      successGlow: 'rgba(34, 197, 94, 0.3)',
      warning: '#f59e0b',
      warningMuted: 'rgba(245, 158, 11, 0.15)',
      warningGlow: 'rgba(245, 158, 11, 0.3)',
      danger: '#ef4444',
      dangerMuted: 'rgba(239, 68, 68, 0.15)',
      dangerGlow: 'rgba(239, 68, 68, 0.3)',
      info: '#3b82f6',
      infoMuted: 'rgba(59, 130, 246, 0.15)',
      infoGlow: 'rgba(59, 130, 246, 0.3)',
    },
    // Chart colors
    chart: [
      '#6366f1', // Indigo
      '#8b5cf6', // Violet
      '#06b6d4', // Cyan
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ec4899', // Pink
      '#f97316', // Orange
      '#14b8a6', // Teal
    ],
    // Glassmorphism
    glass: {
      bg: 'rgba(255, 255, 255, 0.03)',
      border: 'rgba(255, 255, 255, 0.08)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
  },

  gradients: {
    pearl: 'linear-gradient(135deg, #e8e8f0, #d0d0e0)',
    accent: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    success: 'linear-gradient(135deg, #10b981, #14b8a6)',
    danger: 'linear-gradient(135deg, #ef4444, #f97316)',
    surface: 'linear-gradient(180deg, #12121a, #0a0a0f)',
  },

  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },

  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },

  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.3)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.3)',
    '2xl': '0 24px 48px rgba(0, 0, 0, 0.4)',
    glowPrimary: '0 0 20px rgba(99, 102, 241, 0.3)',
    glowSuccess: '0 0 20px rgba(34, 197, 94, 0.3)',
    glowDanger: '0 0 20px rgba(239, 68, 68, 0.3)',
  },

  typography: {
    fontFamily: {
      display: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
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
      '6xl': '3.75rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.2',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  animation: {
    duration: {
      instant: '50ms',
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
      slower: '600ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      spring: 'cubic-bezier(0.5, 0, 0.1, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
    toast: 80,
    top: 90,
    max: 999,
  },
} as const;

// Type exports
export type ColorToken = keyof typeof tokens.colors;
export type SpacingToken = keyof typeof tokens.spacing;
export type RadiusToken = keyof typeof tokens.radius;
export type ShadowToken = keyof typeof tokens.shadows;
export type FontSizeToken = keyof typeof tokens.typography.fontSize;
export type FontWeightToken = keyof typeof tokens.typography.fontWeight;
export type DurationToken = keyof typeof tokens.animation.duration;
export type BreakpointToken = keyof typeof tokens.breakpoints;

// Chart color helper
export const getChartColor = (index: number): string => {
  return tokens.colors.chart[index % tokens.colors.chart.length];
};

// Semantic color helper
export const getSemanticColor = (
  type: 'success' | 'warning' | 'danger' | 'info',
  variant: 'default' | 'muted' | 'glow' = 'default'
): string => {
  const colorMap = {
    success: {
      default: tokens.colors.semantic.success,
      muted: tokens.colors.semantic.successMuted,
      glow: tokens.colors.semantic.successGlow,
    },
    warning: {
      default: tokens.colors.semantic.warning,
      muted: tokens.colors.semantic.warningMuted,
      glow: tokens.colors.semantic.warningGlow,
    },
    danger: {
      default: tokens.colors.semantic.danger,
      muted: tokens.colors.semantic.dangerMuted,
      glow: tokens.colors.semantic.dangerGlow,
    },
    info: {
      default: tokens.colors.semantic.info,
      muted: tokens.colors.semantic.infoMuted,
      glow: tokens.colors.semantic.infoGlow,
    },
  };
  return colorMap[type][variant];
};

export default tokens;