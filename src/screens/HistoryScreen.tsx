/**
 * History Screen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, textStyles } from '../theme';

export default function HistoryScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historique</Text>
            <Text style={styles.subtitle}>Vos transactions</Text>
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
