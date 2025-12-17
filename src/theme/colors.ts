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

export const colors = {
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
} as const;

export type ColorKey = keyof typeof colors;

// Light theme (default)
export const lightTheme = {
  colors,
};

// Dark theme structure (for future implementation)
export const darkTheme = {
  colors: {
    // Placeholder for dark mode colors - to be implemented later
    ...colors,
  },
};

// Export active theme (currently light only)
export const theme = lightTheme;

export default colors;
