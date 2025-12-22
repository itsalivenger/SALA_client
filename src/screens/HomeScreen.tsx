/**
 * Home Screen - Accueil
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';

import { APP_LINKS } from '../config/links';

interface ButtonCard {
    id: number;
    title: string;
    subtitle: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    onPress: () => void;
}

interface HomeScreenProps {
    onNavigate?: (route: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
    const { colors, spacing, textStyles, isDark } = useTheme();
    const buttons: ButtonCard[] = [

        {
            id: 1,
            title: 'Sala',
            subtitle: 'Service standard',
            icon: 'package-variant',
            color: colors.brand,
            onPress: () => onNavigate?.('SalaServices'),
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
            onPress: () => Linking.openURL(APP_LINKS.tutorial),
        },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.greetingContainer}>
                    <Text style={[styles.greeting, { color: colors.brand }]}>Bienvenue sur</Text>
                    <Image
                        source={require('../../assets/home_sala_noBg.png')}
                        style={[styles.inlineLogo, isDark && { tintColor: colors.textPrimary }]}
                        resizeMode="contain"
                    />
                </View>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Que souhaitez-vous faire aujourd'hui ?</Text>
            </View>

            {/* Button Cards */}
            <View style={styles.cardsContainer}>
                {buttons.map((button) => (
                    <TouchableOpacity
                        key={button.id}
                        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
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
                            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{button.title}</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{button.subtitle}</Text>
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
    },
    content: {
        padding: 16,
    },
    header: {
        paddingTop: 32,
        paddingBottom: 40,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    inlineLogo: {
        width: 50,
        height: 36,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    cardsContainer: {
        gap: 16,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        minHeight: 90,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
    },
});
