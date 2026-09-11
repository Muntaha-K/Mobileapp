/**
 * anb simulation — design tokens
 *
 * Single source of truth for the app's look & feel. The palette is inspired by
 * Arab National Bank's (anb) green/teal brand identity. Adjust the values here
 * to re-skin the entire app.
 */

export const colors = {
  // Brand
  primary: '#0B7D6E', // anb green/teal
  primaryDark: '#075B50',
  primaryLight: '#12A08C',
  primarySoft: '#E6F4F1', // tinted background for chips / soft surfaces
  accent: '#C9A24B', // subtle gold used for premium/rewards accents

  // Gradients
  gradientStart: '#0F8A7A',
  gradientEnd: '#075B50',
  cardGradientStart: '#0E9C87',
  cardGradientEnd: '#064A42',

  // Neutrals
  ink: '#0E1B18', // primary text
  body: '#33413D', // body text
  muted: '#6B7A75', // secondary text
  faint: '#9AA8A3', // tertiary text / placeholders
  line: '#E3E9E7', // hairline borders
  surface: '#FFFFFF',
  surfaceAlt: '#F5F8F7', // screen background
  overlay: 'rgba(9, 33, 29, 0.45)',

  // Status
  success: '#1E9E5A',
  successSoft: '#E4F5EC',
  danger: '#D64545',
  dangerSoft: '#FBEAEA',
  warning: '#E0A800',
  info: '#2F6FED',

  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const font = {
  // Using system fonts keeps the app dependency-light and fast to launch.
  // Weights map cleanly onto both iOS (San Francisco) and Android (Roboto).
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    display: 30,
    hero: 38,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const shadow = {
  card: {
    shadowColor: '#0B3D36',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  soft: {
    shadowColor: '#0B3D36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  floating: {
    shadowColor: '#052F29',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const theme = { colors, spacing, radius, font, shadow };
export type Theme = typeof theme;
