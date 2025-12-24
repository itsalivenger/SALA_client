/**
 * Login Screen
 * Allows user to enter phone or email to receive OTP
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ImageBackground,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { ActivityIndicator, Alert } from 'react-native';


interface LoginScreenProps {
    mode: 'login' | 'register';
    onContinue: (identity: string) => void;
    onBack: () => void;
}

export default function LoginScreen({ mode, onContinue, onBack }: LoginScreenProps) {
    const { colors, spacing, textStyles, isDark } = useTheme();
    const [identity, setIdentity] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validatePhone = (text: string) => {
        const phoneRegex = /^(?:\+212|0)([5-7]\d{8})$/; // Moroccan phone number format
        return phoneRegex.test(text);
    };

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Load rememberMe data
        const loadRememberMe = async () => {
            const saved = await authService.getRememberedIdentity();
            if (saved) {
                setIdentity(saved);
                setRememberMe(true);
            }
        };
        loadRememberMe();
    }, []); // Run only once

    const handleContinue = async () => {
        if (!identity.trim()) return;

        if (!validatePhone(identity.trim())) {
            Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide (ex: 0612345678).');
            return;
        }

        setIsLoading(true);
        try {
            if (rememberMe) {
                await authService.saveRememberedIdentity(identity.trim());
            } else {
                await authService.clearRememberedIdentity();
            }

            if (mode === 'login') {
                await authService.login(identity.trim());
            } else {
                await authService.register(identity.trim());
            }
            onContinue(identity.trim());
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Échec de la connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ImageBackground
                source={require('../../../assets/bg_welcome.png')}
                style={styles.background}
                resizeMode="cover"
                blurRadius={10}
            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                        <Text style={[styles.title, { color: '#FFFFFF' }]}>
                            {mode === 'login' ? 'Connexion' : 'Inscription'}
                        </Text>
                        <Text style={[styles.subtitle, { color: '#FFFFFF' }]}>
                            Entrez votre numéro de téléphone pour continuer.
                        </Text>

                        <View style={[styles.inputContainer, { backgroundColor: isDark ? colors.surface + 'EE' : 'rgba(255,255,255,0.95)' }]}>
                            <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Ionicons
                                    name="phone-portrait-outline"
                                    size={20}
                                    color={colors.textSecondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder="ex: 0612345678"
                                    placeholderTextColor={colors.textSecondary}
                                    value={identity}
                                    onChangeText={setIdentity}
                                    autoCapitalize="none"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => setRememberMe(!rememberMe)}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styles.checkbox,
                                            { borderColor: colors.disabled },
                                            rememberMe && [styles.checkboxActive, { backgroundColor: colors.primary, borderColor: colors.primary }],
                                        ]}
                                    >
                                        {rememberMe && (
                                            <Ionicons name="checkmark" size={12} color={colors.surface} />
                                        )}
                                    </View>
                                    <Text style={[styles.checkboxLabel, { color: colors.textSecondary }]}>Se souvenir de moi</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.continueButton,
                                    { backgroundColor: colors.accent },
                                    !identity && [styles.continueButtonDisabled, { backgroundColor: colors.disabled }],
                                ]}
                                onPress={handleContinue}
                                disabled={!identity || isLoading}
                                activeOpacity={0.8}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.textOnPrimary} />
                                ) : (
                                    <Text style={[styles.continueButtonText, { color: colors.textOnPrimary }]}>Continuer</Text>
                                )}
                            </TouchableOpacity>

                            <Text style={[styles.guidanceText, { color: colors.textSecondary }]}>
                                Vous recevrez un code par SMS ou e-mail pour vérifier votre compte.
                            </Text>
                        </View>
                    </Animated.View>

                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.8,
        marginBottom: 48,
    },
    inputContainer: {
        borderRadius: 20,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
    },
    checkboxLabel: {
        fontSize: 12,
    },
    continueButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    continueButtonDisabled: {
    },
    continueButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    guidanceText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});
