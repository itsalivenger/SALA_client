/**
 * SALA Design Tokens - Color Palette
 * Single source of truth for all colors in the app
 * 
 * Usage Rules:
 * - Background: Use only `background` or `surface`
 * - Headings and section titles: Use `brand`
 * - Primary actions and confirmations: Use `accent`
 * - Success states: Use `primary`
 * - Destructive actions: Use `error`
 * - Icons: Use `primary`
 * - Maximum 2 brand colors per screen
 * - No gradients, neon colors, or decorative brand usage
 */

export const lightColors = {
  // SALA Brand Colors
  primary: '#7FC6A4',      // SALA green - success states, icons, toggles ON
  accent: '#F28C4D',       // SALA orange - primary actions, confirmations
  brand: '#4B2D6B',        // SALA purple - headings, section titles

  // Background & Surface
  background: '#F5F5F5',   // App background (light gray)
  surface: '#FFFFFF',      // Card/section backgrounds (white)

  // Text Colors
  textPrimary: '#2E2E2E',  // Primary text (dark gray)
  textSecondary: '#6B6B6B',// Secondary text (medium gray)
  textOnPrimary: '#FFFFFF',// Text on colored backgrounds (white)

  // Semantic Colors
  success: '#7FC6A4',      // Success messages (same as primary)
  warning: '#FFC857',      // Warning messages (yellow)
  error: '#E5543D',        // Error messages, destructive actions (red)
  info: '#6EC6FF',         // Info messages (blue)

  // Utility Colors
  border: '#E3E3E3',       // Borders, dividers (light gray)
  disabled: '#CFCFCF',     // Disabled states, toggles OFF (gray)
  icon: '#2E2E2E',         // Standard icons
  overlay: 'rgba(0,0,0,0.5)',
  pressed: 'rgba(0,0,0,0.05)',
  gradientStart: '#4B2D6B',
  gradientEnd: '#6A3E97',
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
} as const;

export const darkColors = {
  // SALA Brand Colors
  primary: '#8ED7B5',      // Lighter green for dark mode
  accent: '#FF9D5E',       // Lighter orange for dark mode
  brand: '#8E6BB8',        // Lighter purple for dark mode

  // Background & Surface
  background: '#121212',   // True dark background
  surface: '#1E1E1E',      // Elevated surface

  // Text Colors
  textPrimary: '#F5F5F5',  // Off-white text
  textSecondary: '#A0A0A0',// Muted gray text
  textOnPrimary: '#FFFFFF',

  // Semantic Colors
  success: '#8ED7B5',
  warning: '#FFD166',
  error: '#FF6B52',
  info: '#82D1FF',

  // Utility Colors
  border: '#2C2C2C',       // Muted borders
  disabled: '#3A3A3A',     // Darker disabled states
  icon: '#F5F5F5',
  overlay: 'rgba(0,0,0,0.7)',
  pressed: 'rgba(255,255,255,0.05)',
  gradientStart: '#351F4C',
  gradientEnd: '#4B2D6B',
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  }
} as const;

type DeepString<T> = {
  [K in keyof T]: T[K] extends object
  ? DeepString<T[K]>
  : T[K] extends string ? string : T[K] extends number ? number : T[K];
};

export type Colors = DeepString<typeof lightColors>;



// Light theme
export const lightTheme = {
  dark: false,
  colors: lightColors,
};

// Dark theme
export const darkTheme = {
  dark: true,
  colors: darkColors,
};

// Default export (legacy support for simple imports)
export const colors = lightColors;
export default lightColors;

