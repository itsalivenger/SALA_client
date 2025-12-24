/**
 * Profile Setup Screen
 * Final step of registration: Collect name and email
 */

import React, { useState, useRef, useEffect } from 'react';
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
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CityPicker } from '../../components/CityPicker';

interface ProfileSetupScreenProps {
    onComplete: () => void;
}

export default function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
    console.log('[DEBUG] Rendering ProfileSetupScreen');
    const { colors, spacing, textStyles, isDark } = useTheme();
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Erreur', 'Veuillez entrer votre nom');
            return;
        }

        if (!city.trim()) {
            Alert.alert('Erreur', 'Veuillez entrer votre ville');
            return;
        }

        setIsLoading(true);
        try {
            await authService.updateProfile(name, city);
            onComplete();
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Échec de la mise à jour du profil');
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
                <SafeAreaView style={styles.overlay}>
                    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                        <Text style={[styles.title, { color: colors.surface }]}>Bienvenue !</Text>
                        <Text style={[styles.subtitle, { color: colors.surface }]}>
                            Complétez votre profil pour commencer à utiliser SALA.
                        </Text>

                        <View style={[styles.inputCard, { backgroundColor: isDark ? colors.surface + 'EE' : 'rgba(255,255,255,0.95)' }]}>
                            {/* Name Input */}
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Nom complet</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <MaterialCommunityIcons name="account-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder="Ex: John Doe"
                                    placeholderTextColor={colors.textSecondary}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            {/* City Picker */}
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Ville</Text>
                            <CityPicker
                                value={city}
                                onSelect={setCity}
                                placeholder="Sélectionnez votre ville"
                            />


                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    { backgroundColor: colors.accent },
                                    (!name || isLoading) && [styles.saveButtonDisabled, { backgroundColor: colors.disabled }],
                                ]}
                                onPress={handleSave}
                                disabled={!name.trim() || !city.trim() || isLoading}
                                activeOpacity={0.8}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.textOnPrimary} />
                                ) : (
                                    <Text style={[styles.saveButtonText, { color: colors.textOnPrimary }]}>Terminer</Text>
                                )}
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
    content: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.8,
        marginBottom: 48,
    },
    inputCard: {
        borderRadius: 20,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 24,
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    saveButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    saveButtonDisabled: {
    },
    saveButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
