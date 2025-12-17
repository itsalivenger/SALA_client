/**
 * Home Screen - Accueil
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, textStyles } from '../theme';

interface ButtonCard {
    id: number;
    title: string;
    subtitle: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    onPress: () => void;
}

export default function HomeScreen() {
    const buttons: ButtonCard[] = [
        {
            id: 1,
            title: 'Sala',
            subtitle: 'Service standard',
            icon: 'package-variant',
            color: colors.brand,
            onPress: () => console.log('Sala pressed'),
        },
        {
            id: 2,
            title: 'Sala Express',
            subtitle: 'Livraison rapide',
            icon: 'truck-fast',
            color: colors.accent,
            onPress: () => console.log('Sala Express pressed'),
        },
        {
            id: 3,
            title: 'Tutoriel',
            subtitle: 'Guide d\'utilisation',
            icon: 'book-open-page-variant',
            color: colors.primary,
            onPress: () => console.log('Tutoriel pressed'),
        },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Bienvenue sur SALA</Text>
                <Text style={styles.subtitle}>Que souhaitez-vous faire aujourd'hui ?</Text>
            </View>

            {/* Button Cards */}
            <View style={styles.cardsContainer}>
                {buttons.map((button) => (
                    <TouchableOpacity
                        key={button.id}
                        style={styles.card}
                        onPress={button.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${button.color}15` }]}>
                            <MaterialCommunityIcons
                                name={button.icon}
                                size={32}
                                color={button.color}
                            />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{button.title}</Text>
                            <Text style={styles.cardSubtitle}>{button.subtitle}</Text>
                        </View>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={24}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.base,
    },
    header: {
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.sm,
    },
    greeting: {
        ...textStyles.h2,
        color: colors.brand,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...textStyles.body,
        color: colors.textSecondary,
    },
    cardsContainer: {
        gap: spacing.base,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.base,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: 90,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.base,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        ...textStyles.h3,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    cardSubtitle: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
});
