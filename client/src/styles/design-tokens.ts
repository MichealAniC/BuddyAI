/**
 * BuddyAI Design System — Clinical Calm Tokens
 *
 * Single source of truth for the visual language of the application.
 * Values here are mirrored in the Tailwind theme and in globals.css so
 * components can use either utility classes or direct token imports.
 *
 * Palette philosophy:
 * - Primary: Soft teal/blue-teal (trust, calm, clinical professionalism)
 * - Sage: Muted green (success, growth, wellbeing)
 * - Amber: Warm amber (warning, caution, attention)
 * - Rose: Soft red (critical alerts, danger — readable but not aggressive)
 * - Neutral: Clean warm gray (surfaces, borders, dividers)
 * - Slate: Cool gray (text hierarchy, subtle backgrounds)
 */

export const colors = {
  /* Primary: Soft Teal / Blue-Teal */
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  /* Success / Secondary: Sage Green */
  sage: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#6b9080',
    600: '#527a68',
    700: '#3d5c4e',
    800: '#2f4a3d',
    900: '#1f352c',
  },

  /* Secondary alias — preserved for existing components */
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#6b9080',
    600: '#527a68',
    700: '#3d5c4e',
    800: '#2f4a3d',
    900: '#1f352c',
  },

  /* Warning: Warm Amber */
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  /* Danger / Critical: Soft Rose */
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },

  /* Neutral: Clean warm gray for surfaces and borders */
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },

  /* Soft Slate: Cool gray for text and subtle backgrounds */
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  /* Semantic aliases — use these for meaning, not decoration */
  semantic: {
    success: '#6b9080',
    warning: '#f59e0b',
    danger: '#f43f5e',
    info: '#14b8a6',
  },

  /* Surfaces */
  surface: {
    DEFAULT: '#f8fafc',
    secondary: '#f1f5f9',
    elevated: '#ffffff',
  },

  /* Borders */
  border: '#e2e8f0',

  /* Text */
  text: {
    DEFAULT: '#334155',
    muted: '#64748b',
    inverse: '#ffffff',
  },
} as const;

/**
 * 4px / 8px-based spacing scale.
 * Tailwind's default scale already follows this, but the explicit semantic
 * names keep the design system intent clear.
 */
export const spacing = {
  0: '0rem',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans)',
    mono: 'var(--font-geist-mono)',
    fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  sizes: {
    xs: '0.75rem',    // 12px — captions, helper text
    sm: '0.875rem',   // 14px — body small, labels
    base: '1rem',     // 16px — body
    lg: '1.125rem',   // 18px — lead
    xl: '1.25rem',    // 20px — h4
    '2xl': '1.5rem',  // 24px — h3
    '3xl': '1.875rem',// 30px — h2
    '4xl': '2.25rem', // 36px — h1
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
} as const;

export const radius = {
  none: '0px',
  sm: '6px',
  DEFAULT: '10px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  sanctuary: '24px',
  full: '9999px',
} as const;

export const shadows = {
  card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
  elevated: '0 4px 12px rgba(0, 0, 0, 0.06)',
  sanctuary: '0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
  focus: '0 0 0 3px rgba(20, 184, 166, 0.25)',
} as const;

export const sanctuaryTheme = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
} as const;

export type SanctuaryTheme = typeof sanctuaryTheme;
