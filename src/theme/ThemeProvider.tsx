import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, Colors } from './colors';
import spacing from './spacing';
import typography, { textStyles } from './typography';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    mode: ThemeMode;
    colors: Colors;
    spacing: typeof spacing;
    typography: typeof typography;
    textStyles: typeof textStyles;
    isDark: boolean;
    setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = '@sala_theme_mode';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');

    useEffect(() => {
        // Load persisted theme
        const loadTheme = async () => {
            try {
                const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedMode) {
                    setMode(savedMode as ThemeMode);
                }
            } catch (error) {
                console.error('Failed to load theme mode from storage', error);
            }
        };
        loadTheme();
    }, []);

    const setThemeMode = useCallback(async (newMode: ThemeMode) => {
        setMode(newMode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
        } catch (error) {
            console.error('Failed to save theme mode to storage', error);
        }
    }, []);

    const activeMode = mode === 'system' ? (systemColorScheme || 'light') : mode;
    const colors = activeMode === 'dark' ? darkColors : lightColors;

    const value: ThemeContextType = useMemo(() => {
        console.log(`[THEME] Recalculating theme value: mode=${mode}, active=${activeMode}`);
        return {
            mode,
            colors,
            spacing,
            typography,
            textStyles,
            isDark: activeMode === 'dark',
            setThemeMode,
        };
    }, [mode, activeMode, colors, setThemeMode]);

    console.log('[THEME] Provider Rendered');

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
