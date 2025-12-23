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
import { useTheme } from '../theme';


interface WelcomeScreenProps {
    onLogin: () => void;
    onRegister: () => void;
    onSkip: () => void;
}

export default function WelcomeScreen({ onLogin, onRegister, onSkip }: WelcomeScreenProps) {
    const { colors, spacing, textStyles, isDark } = useTheme();
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
                            <Image
                                source={require('../../assets/home_sala_noBg.png')}
                                style={[styles.logo, isDark && { tintColor: colors.textPrimary }]}
                                resizeMode="contain"
                            />
                            <Text style={[styles.headline, { color: colors.surface }]}>Bienvenue sur SALA</Text>
                            <Text style={[styles.subtext, { color: colors.surface }]}>
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
                                style={[styles.loginButton, { backgroundColor: colors.accent }]}
                                onPress={onLogin}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.loginButtonText, { color: colors.textOnPrimary }]}>Se connecter</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.registerButton, { borderColor: colors.surface }]}
                                onPress={onRegister}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.registerButtonText, { color: colors.surface }]}>Créer un compte</Text>
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
        paddingHorizontal: 20, // spacing tokens fallback
        paddingTop: 16,
    },
    skipButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    skipText: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    textContainer: {
        marginBottom: 48,
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 120,
        marginBottom: 4,
    },
    headline: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtext: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.9,
    },
    buttonContainer: {
        gap: 16,
        marginTop: 24,
    },
    loginButton: {
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
        fontWeight: 'bold',
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: 'transparent',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    registerButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

