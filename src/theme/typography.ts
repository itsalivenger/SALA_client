/**
 * SALA Design Tokens - Typography
 * Text styles for consistent typography across the app
 */

import { Platform, TextStyle } from 'react-native';

export const typography = {
    // Font Sizes
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 28,
        huge: 32,
    },

    // Font Weights
    fontWeight: {
        regular: '400' as TextStyle['fontWeight'],
        medium: '500' as TextStyle['fontWeight'],
        semibold: '600' as TextStyle['fontWeight'],
        bold: '700' as TextStyle['fontWeight'],
    },

    // Line Heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const;

// Text Style Presets
export const textStyles = {
    // Headings
    h1: {
        fontSize: typography.fontSize.huge,
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.fontSize.huge * typography.lineHeight.tight,
    },
    h2: {
        fontSize: typography.fontSize.xxxl,
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.fontSize.xxxl * typography.lineHeight.tight,
    },
    h3: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.fontSize.xxl * typography.lineHeight.tight,
    },

    // Section Titles
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
    },

    // Body Text
    body: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    },
    bodyBold: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    },

    // Small Text
    caption: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    },
    captionBold: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    },

    // Labels
    label: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
    },
} as const;

export default typography;
