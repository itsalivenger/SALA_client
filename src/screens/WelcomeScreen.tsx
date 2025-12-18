/**
 * Welcome Screen
 * First interaction after splash, offers Login and Registration
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, textStyles } from '../theme';

interface WelcomeScreenProps {
    onLogin: () => void;
    onRegister: () => void;
    onSkip: () => void;
}

export default function WelcomeScreen({ onLogin, onRegister, onSkip }: WelcomeScreenProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/bg_welcome.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
                            <Text style={styles.skipText}>Passer</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Animated.View
                            style={[
                                styles.textContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <View style={styles.headlineContainer}>
                                <Text style={styles.headline}>Bienvenue sur</Text>
                                <Image
                                    source={require('../../assets/home_sala_noBg.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.subtext}>
                                Vos courses livrées par des professionnels vérifiés
                            </Text>
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.buttonContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={onLogin}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.loginButtonText}>Se connecter</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={onRegister}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.registerButtonText}>Créer un compte</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)', // Subtle dark overlay for readability
    },
    header: {
        alignItems: 'flex-end',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
    },
    skipButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    skipText: {
        ...textStyles.captionBold,
        color: colors.surface,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl * 2,
    },
    textContainer: {
        marginBottom: spacing.xxl,
        alignItems: 'center',
    },
    headlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    headline: {
        ...textStyles.h1,
        color: colors.surface,
    },
    logo: {
        width: 80,
        height: 40,
        marginLeft: spacing.xs,
    },
    subtext: {
        ...textStyles.body,
        color: colors.surface,
        textAlign: 'center',
        opacity: 0.9,
    },
    buttonContainer: {
        gap: spacing.base,
    },
    loginButton: {
        backgroundColor: colors.accent,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loginButtonText: {
        ...textStyles.bodyBold,
        color: colors.textOnPrimary,
    },
    registerButton: {
        backgroundColor: 'transparent',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.surface,
    },
    registerButtonText: {
        ...textStyles.bodyBold,
        color: colors.surface,
    },
});

