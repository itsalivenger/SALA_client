/**
 * SALA Theme System
 * Central export for all design tokens
 * Ready for future dark mode extension
 */

import colors, { lightTheme, darkTheme } from './colors';
import spacing from './spacing';
import typography, { textStyles } from './typography';

export const theme = {
    colors,
    spacing,
    typography,
    textStyles,
};

// Theme variants (for future dark mode implementation)
export const themes = {
    light: {
        ...lightTheme,
        spacing,
        typography,
        textStyles,
    },
    dark: {
        ...darkTheme,
        spacing,
        typography,
        textStyles,
    },
};

export type Theme = typeof theme;
export type ThemeMode = 'light' | 'dark';

export { colors, spacing, typography, textStyles };
export default theme;
