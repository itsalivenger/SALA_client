/**
 * Home Screen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, textStyles } from '../theme';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Accueil</Text>
            <Text style={styles.subtitle}>Bienvenue sur SALA!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    title: {
        ...textStyles.h1,
        color: colors.brand,
        marginBottom: spacing.md,
    },
    subtitle: {
        ...textStyles.body,
        color: colors.textSecondary,
    },
});
