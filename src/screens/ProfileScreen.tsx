/**
 * Profile Screen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, textStyles } from '../theme';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil</Text>
            <Text style={styles.subtitle}>Vos informations personnelles</Text>
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
