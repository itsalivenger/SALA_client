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
import { colors, spacing, textStyles } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
    onContinue: (identity: string) => void;
    onBack: () => void;
}

export default function LoginScreen({ onContinue, onBack }: LoginScreenProps) {
    const [identity, setIdentity] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []); // Run only once

    const handleContinue = () => {
        if (identity.trim()) {
            onContinue(identity);
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
                            <Ionicons name="arrow-back" size={24} color={colors.surface} />
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                        <Text style={styles.title}>Connexion</Text>
                        <Text style={styles.subtitle}>
                            Entrez votre numéro de téléphone ou votre e-mail pour continuer.
                        </Text>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color={colors.textSecondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Téléphone ou e-mail"
                                    placeholderTextColor={colors.textSecondary}
                                    value={identity}
                                    onChangeText={setIdentity}
                                    autoCapitalize="none"
                                    keyboardType="default"
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
                                            rememberMe && styles.checkboxActive,
                                        ]}
                                    >
                                        {rememberMe && (
                                            <Ionicons name="checkmark" size={12} color={colors.surface} />
                                        )}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Se souvenir de moi</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.continueButton,
                                    !identity && styles.continueButtonDisabled,
                                ]}
                                onPress={handleContinue}
                                disabled={!identity}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.continueButtonText}>Continuer</Text>
                            </TouchableOpacity>

                            <Text style={styles.guidanceText}>
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
        backgroundColor: 'rgba(0,0,0,0.5)', // Darker overlay for login context
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: spacing.base,
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
        paddingHorizontal: spacing.xl,
        justifyContent: 'center',
    },
    title: {
        ...textStyles.h2,
        color: colors.surface,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...textStyles.body,
        color: colors.surface,
        opacity: 0.8,
        marginBottom: spacing.xxl,
    },
    inputContainer: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: spacing.base,
        height: 56,
        marginBottom: spacing.base,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...textStyles.body,
        color: colors.textPrimary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
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
        borderColor: colors.disabled,
        marginRight: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkboxLabel: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    continueButton: {
        backgroundColor: colors.accent,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    continueButtonDisabled: {
        backgroundColor: colors.disabled,
    },
    continueButtonText: {
        ...textStyles.bodyBold,
        color: colors.textOnPrimary,
    },
    guidanceText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
    },
});
