/**
 * anb simulation — design tokens
 *
 * Single source of truth for the app's look & feel. The palette follows Arab
 * National Bank's (anb) blue brand identity. Adjust the values here to
 * re-skin the entire app.
 */

export const colors = {
  // Brand
  primary: '#0B6FE0', // anb blue
  primaryDark: '#0A54AB',
  primaryLight: '#4E96EC',
  primarySoft: '#E7F1FD', // tinted background for chips / soft surfaces
  accent: '#F2A93B', // warm accent used for rewards / highlights

  // Gradients
  gradientStart: '#1E86F0',
  gradientEnd: '#0A57C4',
  cardGradientStart: '#1F86F0',
  cardGradientEnd: '#0A3E9E',

  // Neutrals (cool blue-grey)
  ink: '#0F1B2D', // primary text
  body: '#334155', // body text
  muted: '#64748B', // secondary text
  faint: '#94A3B8', // tertiary text / placeholders
  line: '#E4EAF1', // hairline borders
  surface: '#FFFFFF',
  surfaceAlt: '#EFF3F8', // screen background (soft blue-grey)
  overlay: 'rgba(10, 25, 47, 0.45)',

  // Status
  success: '#1E9E5A',
  successSoft: '#E4F5EC',
  danger: '#E0453C',
  dangerSoft: '#FBEAEA',
  warning: '#E0A800',
  info: '#0B6FE0',

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
