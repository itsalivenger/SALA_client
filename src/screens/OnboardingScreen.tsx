/**
 * Onboarding/Tutorial Screen
 * 3-slide tutorial with Next/Prev navigation and Skip button
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
} from 'react-native';
import { colors, spacing, textStyles } from '../theme';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
    onFinish: () => void;
}

const slides = [
    {
        id: 1,
        title: 'Bienvenue sur SALA',
        description: 'Votre partenaire financier de confiance pour des transactions sécurisées et faciles',
        // Placeholder image - replace with actual tutorial image
        image: require('../../assets/icon.png'),
    },
    {
        id: 2,
        title: 'Rapide & Sécurisé',
        description: 'Profitez de paiements fluides avec une sécurité de premier ordre',
        // Placeholder image - replace with actual tutorial image
        image: require('../../assets/icon.png'),
    },
    {
        id: 3,
        title: 'Commencer',
        description: 'Rejoignez des milliers de clients satisfaits qui utilisent SALA chaque jour',
        // Placeholder image - replace with actual tutorial image
        image: require('../../assets/icon.png'),
    },
];

export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === slides.length - 1;

    const handleNext = () => {
        if (isLastSlide) {
            onFinish();
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirstSlide) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleSkip = () => {
        onFinish();
    };

    return (
        <View style={styles.container}>
            {/* Skip Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipText}>Passer</Text>
                </TouchableOpacity>
            </View>

            {/* Slide Content */}
            <View style={styles.slideContainer}>
                <Image
                    source={slides[currentSlide].image}
                    style={styles.slideImage}
                    resizeMode="contain"
                />
                <Text style={styles.slideTitle}>{slides[currentSlide].title}</Text>
                <Text style={styles.slideDescription}>
                    {slides[currentSlide].description}
                </Text>
            </View>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentSlide ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.footer}>
                {!isFirstSlide && (
                    <TouchableOpacity
                        onPress={handlePrev}
                        style={[styles.button, styles.prevButton]}
                    >
                        <Text style={styles.prevButtonText}>Précédent</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={handleNext}
                    style={[
                        styles.button,
                        styles.nextButton,
                        isFirstSlide && styles.nextButtonFullWidth,
                    ]}
                >
                    <Text style={styles.nextButtonText}>
                        {isLastSlide ? 'Terminer' : 'Suivant'}
                    </Text>
                </TouchableOpacity>
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
        paddingHorizontal: spacing.base,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        alignItems: 'flex-end',
    },
    skipButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.base,
    },
    skipText: {
        ...textStyles.body,
        color: colors.textSecondary,
    },
    slideContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    slideImage: {
        width: width * 0.6,
        height: width * 0.6,
        marginBottom: spacing.xl,
    },
    slideTitle: {
        ...textStyles.h2,
        color: colors.brand,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    slideDescription: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: colors.primary,
        width: 24,
    },
    inactiveDot: {
        backgroundColor: colors.disabled,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.base,
        paddingBottom: spacing.xl,
        gap: spacing.md,
    },
    button: {
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    prevButton: {
        flex: 1,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    prevButtonText: {
        ...textStyles.bodyBold,
        color: colors.textPrimary,
    },
    nextButton: {
        flex: 1,
        backgroundColor: colors.accent,
    },
    nextButtonFullWidth: {
        flex: 1,
    },
    nextButtonText: {
        ...textStyles.bodyBold,
        color: colors.textOnPrimary,
    },
});
