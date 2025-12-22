import { lightColors, darkColors } from './colors';
import spacing from './spacing';
import typography, { textStyles } from './typography';
import { ThemeProvider, ThemeContext } from './ThemeProvider';
import { useTheme } from './useTheme';

export {
    lightColors,
    darkColors,
    spacing,
    typography,
    textStyles,
    ThemeProvider,
    ThemeContext,
    useTheme
};

export type { ThemeMode } from './ThemeProvider';
export type { Colors } from './colors';

