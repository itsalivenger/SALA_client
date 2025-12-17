/**
 * Sala Service Screen
 * Displays 5 options in a circular layout
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, textStyles } from '../theme';

interface SalaServiceScreenProps {
    onBack: () => void;
}

export default function SalaServiceScreen({ onBack }: SalaServiceScreenProps) {
    const { width } = Dimensions.get('window');
    const CIRCLE_RADIUS = 120; // Radius of the circle on which buttons are placed
    const BUTTON_SIZE = 80; // Size of the circular buttons
    const CENTER_X = width / 2; // Center of the screen horizontally

    // Define the 5 options
    const options = [
        { id: 1, title: 'Option 1', icon: 'star-outline' },
        { id: 2, title: 'Option 2', icon: 'heart-outline' },
        { id: 3, title: 'Option 3', icon: 'bell-outline' },
        { id: 4, title: 'Option 4', icon: 'cog-outline' },
        { id: 5, title: 'Option 5', icon: 'shield-outline' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color={colors.brand} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Services Sala</Text>
            </View>

            <View style={styles.content}>
                {/* Center Point - could be logo or empty */}
                <View style={styles.centerPoint}>
                    <Image
                        source={require('../../assets/home_sala_noBg.png')}
                        style={styles.centerLogo}
                        resizeMode="contain"
                    />
                </View>

                {/* Circular Buttons */}
                {options.map((option, index) => {
                    // Calculate position
                    // Start from -90deg (top) and go clockwise
                    const angleDeg = -90 + (index * (360 / options.length));
                    const angleRad = (angleDeg * Math.PI) / 180;

                    const translateX = Math.cos(angleRad) * CIRCLE_RADIUS;
                    const translateY = Math.sin(angleRad) * CIRCLE_RADIUS;

                    return (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.circleButton,
                                {
                                    transform: [
                                        { translateX },
                                        { translateY }
                                    ]
                                }
                            ]}
                            onPress={() => console.log(`${option.title} pressed`)}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name={option.icon as any}
                                size={32}
                                color={colors.textOnPrimary}
                            />
                            <Text style={styles.buttonLabel}>{option.title}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.base,
        paddingTop: spacing.xl,
    },
    backButton: {
        padding: spacing.sm,
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.brand,
        marginLeft: spacing.sm,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -50, // Slight visual adjustment to center in available space
    },
    centerPoint: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Removed position: 'absolute' to let flexbox center it naturally
        // position: 'absolute', 
        zIndex: 1,
    },
    centerLogo: {
        width: 60,
        height: 60,
        marginLeft: -4, // Nudge left specific amount
    },
    circleButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonLabel: {
        ...textStyles.caption,
        color: colors.textOnPrimary,
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
});
