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
import { SafeAreaView } from 'react-native-safe-area-context';

interface OtpScreenProps {
    identity: string;
    onVerify: (code: string) => void;
    onBack: () => void;
}

export default function OtpScreen({ identity, onVerify, onBack }: OtpScreenProps) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(59);
    const inputs = useRef<Array<TextInput | null>>([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Timer
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleCodeChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Move to next input if text is entered
        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }

        // If all digits are filled, auto-verify
        if (newCode.every((digit) => digit !== '') && newCode.length === 6) {
            onVerify(newCode.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (timer === 0) {
            setTimer(59);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ImageBackground
                source={require('../../../assets/bg_welcome.png')}
                style={styles.background}
                resizeMode="cover"
                blurRadius={10}
            >
                <SafeAreaView style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.surface} />
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                        <Text style={styles.title}>Vérification</Text>
                        <Text style={styles.subtitle}>
                            Nous avons envoyé un code de vérification à{' '}
                            <Text style={styles.identityHighlight}>{identity}</Text>
                        </Text>

                        <View style={styles.inputCard}>
                            <View style={styles.otpContainer}>
                                {code.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => { inputs.current[index] = ref; }}
                                        style={[
                                            styles.otpInput,
                                            digit ? styles.otpInputFilled : null,
                                        ]}
                                        value={digit}
                                        onChangeText={(text) => handleCodeChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        selectTextOnFocus
                                    />
                                ))}
                            </View>

                            <View style={styles.timerContainer}>
                                <Text style={styles.timerText}>
                                    {timer > 0
                                        ? `Renvoyer le code dans 0:${timer.toString().padStart(2, '0')}`
                                        : 'Vous ne recevez pas de code ?'}
                                </Text>
                                <TouchableOpacity
                                    onPress={handleResend}
                                    disabled={timer > 0}
                                >
                                    <Text
                                        style={[
                                            styles.resendText,
                                            timer > 0 && styles.resendTextDisabled,
                                        ]}
                                    >
                                        Renvoyer
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.verifyButton,
                                    code.some((d) => !d) && styles.verifyButtonDisabled,
                                ]}
                                onPress={() => onVerify(code.join(''))}
                                disabled={code.some((d) => !d)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.verifyButtonText}>Vérifier</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </SafeAreaView>
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
        paddingHorizontal: spacing.base,
        paddingTop: spacing.base,
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
    identityHighlight: {
        fontWeight: '700',
        color: colors.surface,
    },
    inputCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    otpInput: {
        width: (Platform.OS === 'ios' ? 44 : 40),
        height: 56,
        backgroundColor: colors.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        textAlign: 'center',
        ...textStyles.h3,
        color: colors.textPrimary,
    },
    otpInputFilled: {
        borderColor: colors.accent,
        borderWidth: 2,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    timerText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    resendText: {
        ...textStyles.bodyBold,
        color: colors.accent,
    },
    resendTextDisabled: {
        color: colors.disabled,
    },
    verifyButton: {
        backgroundColor: colors.accent,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifyButtonDisabled: {
        backgroundColor: colors.disabled,
    },
    verifyButtonText: {
        ...textStyles.bodyBold,
        color: colors.textOnPrimary,
    },
});
