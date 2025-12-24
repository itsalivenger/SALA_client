/**
 * Profile Screen - SALA Pro (Livreur)
 * Nested Navigation View - Identity, compliance, and control panel.
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Alert,
    TextInput,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import type { ThemeMode } from '../theme';
import { authService } from '../services/authService';
import { CityPicker } from '../components/CityPicker';
import { APP_LINKS } from '../config/links';



// Types
type AccountStatus = 'pending' | 'approved' | 'suspended';
type SubView = 'menu' | 'status' | 'documents' | 'personal_info' | 'edit_profile' | 'theme_selector' | 'phone_change' | 'security';


const PersonalInfoDetailView = ({ user, colors, setCurrentView, fadeAnim }: any) => (
    <Animated.View style={{ opacity: fadeAnim }}>
        <SubViewHeader title="Informations personnelles" onBack={() => setCurrentView('menu')} />

        <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ListItem icon="phone-outline" title="Téléphone" value={user?.phoneNumber || ''} showChevron={false} />
            <ListItem icon="account-outline" title="Nom complet" value={user?.name || 'Non renseigné'} showChevron={false} />
            <ListItem icon="map-marker-outline" title="Ville" value={user?.city || 'Non renseignée'} showChevron={false} isLast />
        </View>

        <TouchableOpacity
            style={[styles.modifyAction, { backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 12, marginTop: 24, padding: 16, borderWidth: 1, borderColor: colors.border }]}
            onPress={() => setCurrentView('edit_profile')}
        >
            <MaterialCommunityIcons name="pencil-outline" size={24} color={colors.accent} />
            <Text style={[styles.modifyActionText, { color: colors.accent }]}>Modifier mes informations</Text>
        </TouchableOpacity>

        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 24 }]}>
            <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.infoBoxText, { color: colors.textSecondary }]}>
                Certaines informations comme le numéro de téléphone ne peuvent être modifiées que par le support SALA.
            </Text>
        </View>
    </Animated.View>
);

const PhoneChangeView = ({ user, colors, setCurrentView, fadeAnim }: any) => {
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequestOtp = async () => {
        if (!newPhoneNumber.trim()) {
            Alert.alert('Erreur', 'Veuillez saisir un numéro de téléphone');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authService.requestPhoneChange(newPhoneNumber);
            if (response.success) {
                setOtpSent(true);
                Alert.alert('Succès', response.message || 'Code envoyé au nouveau numéro');
            } else {
                Alert.alert('Erreur', response.message || 'Impossible d\'envoyer le code');
            }
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error?.data?.message || error?.message || 'Une erreur est survenue';
            Alert.alert('Erreur', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            Alert.alert('Erreur', 'Veuillez saisir le code de vérification');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authService.verifyPhoneChange(newPhoneNumber, otp);
            if (response.success) {
                Alert.alert(
                    'Succès',
                    'Votre numéro a été mis à jour avec succès',
                    [{ text: 'OK', onPress: () => setCurrentView('menu') }]
                );
            } else {
                Alert.alert('Erreur', response.message || 'Code invalide');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            <SubViewHeader title="Changer de numéro" onBack={() => setCurrentView('menu')} />

            <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoBoxText, { color: colors.textSecondary }]}>
                    Un code de vérification sera envoyé au nouveau numéro par SMS.
                </Text>
            </View>

            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
                <View style={{ padding: 16 }}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Numéro actuel</Text>
                    <Text style={[styles.currentPhone, { color: colors.textPrimary }]}>{user?.phoneNumber}</Text>
                </View>
            </View>

            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
                <View style={{ padding: 16 }}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nouveau numéro</Text>
                    <TextInput
                        style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                        placeholder="0612345678"
                        placeholderTextColor={colors.disabled}
                        value={newPhoneNumber}
                        onChangeText={setNewPhoneNumber}
                        keyboardType="phone-pad"
                        editable={!otpSent}
                    />
                </View>
            </View>

            {otpSent && (
                <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
                    <View style={{ padding: 16 }}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Code de vérification</Text>
                        <TextInput
                            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                            placeholder="123456"
                            placeholderTextColor={colors.disabled}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </View>
                </View>
            )}

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    { backgroundColor: isSubmitting ? colors.disabled : colors.brand, marginTop: 24 }
                ]}
                onPress={otpSent ? handleVerifyOtp : handleRequestOtp}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color={colors.surface} />
                ) : (
                    <Text style={[styles.submitButtonText, { color: colors.surface }]}>
                        {otpSent ? 'Vérifier le code' : 'Envoyer le code'}
                    </Text>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};


const SecurityView = ({ colors, setCurrentView, fadeAnim }: any) => (
    <Animated.View style={{ opacity: fadeAnim }}>
        <SubViewHeader title="Sécurité & Confidentialité" onBack={() => setCurrentView('menu')} />

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>COMPTE</Text>
        <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ListItem
                icon="phone-sync-outline"
                title="Changer de numéro"
                onPress={() => setCurrentView('phone_change')}
                isLast
            />
        </View>
    </Animated.View>
);


interface ListItemProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    titleColor?: string;
    badge?: string;
    badgeColor?: string;
    isLast?: boolean;
    iconColor?: string;
}

const ListItem = ({
    icon,
    title,
    value,
    onPress,
    showChevron = true,
    titleColor,
    badge,
    badgeColor,
    isLast,
    iconColor
}: ListItemProps) => {
    const { colors } = useTheme();
    const finalTitleColor = titleColor || colors.textPrimary;
    const finalIconColor = iconColor || colors.textSecondary;

    return (
        <>
            <TouchableOpacity
                style={[styles.listItem, { backgroundColor: colors.surface }]}
                onPress={onPress}
                activeOpacity={0.7}
                disabled={!onPress}
            >
                <View style={styles.listItemLeft}>
                    <MaterialCommunityIcons name={icon} size={22} color={finalIconColor} />
                    <Text style={[styles.listItemTitle, { color: finalTitleColor }]}>{title}</Text>
                </View>
                <View style={styles.listItemRight}>
                    {badge && (
                        <View style={[styles.inlineBadge, { backgroundColor: badgeColor ? badgeColor + '15' : colors.border }]}>
                            <Text style={[styles.inlineBadgeText, { color: badgeColor || colors.textSecondary }]}>{badge}</Text>
                        </View>
                    )}
                    {value && <Text style={[styles.listItemValue, { color: colors.textSecondary }]}>{value}</Text>}
                    {showChevron && <MaterialCommunityIcons name="chevron-right" size={20} color={colors.disabled} />}
                </View>
            </TouchableOpacity>
            {!isLast && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
        </>
    );
};

const SubViewHeader = ({ title, onBack }: { title: string; onBack: () => void }) => {
    const { colors } = useTheme();
    return (
        <View style={[styles.subViewHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
            </TouchableOpacity>
            <Text style={[styles.subViewTitle, { color: colors.brand }]}>{title}</Text>
        </View>
    );
};


// --- Sub-components to avoid Rules of Hooks violations ---

const UnauthenticatedView = ({ colors, onAuthAction, onNavigate, mode, setCurrentView, fadeAnim }: any) => (
    <Animated.View style={[styles.unauthContainer, { opacity: fadeAnim }]}>
        <View style={[styles.unauthIconCircle, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="account-lock-outline" size={60} color={colors.brand} />
        </View>
        <Text style={[styles.unauthTitle, { color: colors.textPrimary }]}>Accès Restreint</Text>
        <Text style={[styles.unauthSubtitle, { color: colors.textSecondary }]}>
            Veuillez vous connecter ou créer un compte pour accéder à votre profil et gérer vos commandes.
        </Text>

        <TouchableOpacity
            style={[styles.authButton, { backgroundColor: colors.brand }]}
            onPress={() => onAuthAction?.('login')}
        >
            <Text style={[styles.authButtonText, { color: colors.textOnPrimary }]}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.authButtonOutline, { borderColor: colors.brand }]}
            onPress={() => onAuthAction?.('register')}
        >
            <Text style={[styles.authButtonTextOutline, { color: colors.brand }]}>S'inscrire</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary, marginTop: 48 }]}>PARAMÈTRES DE L'APP</Text>
        <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ListItem icon="translate" title="Langue" value="Français" onPress={() => onNavigate?.('Language')} />
            <ListItem
                icon="theme-light-dark"
                title="Thème"
                value={mode === 'system' ? 'Système' : mode === 'dark' ? 'Sombre' : 'Clair'}
                onPress={() => setCurrentView('theme_selector')}
            />
            <ListItem
                icon="file-document-outline"
                title="Privacy & Conditions"
                onPress={() => Linking.openURL(APP_LINKS.terms)}
                isLast
            />
        </View>
    </Animated.View>
);

const MenuView = ({ user, colors, spacing, setCurrentView, mode, onNavigate, handleLogout, fadeAnim }: any) => (
    <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[styles.screenTitle, { color: colors.brand }]}>Profil</Text>

        <TouchableOpacity
            style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
            onPress={() => setCurrentView('personal_info')}
            activeOpacity={0.7}
        >
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <MaterialCommunityIcons name="account" size={44} color={colors.textSecondary} />
            </View>
            <View style={styles.headerInfo}>
                <Text style={[styles.fullName, { color: colors.textPrimary }]}>{user.name || 'Utilisateur SALA'}</Text>
                <Text style={[styles.phoneNumberText, { color: colors.textSecondary }]}>{user.phoneNumber}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.disabled} style={{ marginLeft: spacing.sm }} />
        </TouchableOpacity>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>MON COMPTE</Text>
        <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ListItem
                icon="account-outline"
                title="Informations personnelles"
                onPress={() => setCurrentView('personal_info')}
            />
            <ListItem
                icon="shield-key-outline"
                title="Sécurité & Confidentialité"
                onPress={() => setCurrentView('security')}
                isLast
            />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>PARAMÈTRES DE L'APP</Text>
        <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ListItem icon="bell-outline" title="Notifications" onPress={() => onNavigate?.('Notifications')} />
            <ListItem icon="translate" title="Langue" value="Français" onPress={() => onNavigate?.('Language')} />
            <ListItem
                icon="theme-light-dark"
                title="Thème"
                value={mode === 'system' ? 'Système' : mode === 'dark' ? 'Sombre' : 'Clair'}
                onPress={() => setCurrentView('theme_selector')}
            />
            <ListItem
                icon="headphones"
                title="Support & Contact"
                onPress={() => onNavigate?.('Support')}
                isLast
            />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>SÉCURITÉ ET LÉGAL</Text>
        <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ListItem
                icon="file-document-outline"
                title="Conditions Générales"
                onPress={() => Linking.openURL(APP_LINKS.terms)}
            />
            <ListItem
                icon="shield-lock-outline"
                title="Politique de Confidentialité"
                onPress={() => Linking.openURL(APP_LINKS.privacy)}
                isLast
            />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
            <Text style={[styles.version, { color: colors.disabled }]}>SALA Client • v2.1.0</Text>
        </View>
    </Animated.View>
);

const ThemeSelectorView = ({ colors, isDark, mode, setThemeMode, setCurrentView, fadeAnim }: any) => (
    <Animated.View style={{ opacity: fadeAnim }}>
        <SubViewHeader title="Thème de l'application" onBack={() => setCurrentView('menu')} />

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>SÉLECTIONNER UN THÈME</Text>
        <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ListItem
                icon="monitor"
                title="Système (Défaut)"
                showChevron={false}
                badge={mode === 'system' ? 'Activé' : undefined}
                badgeColor={colors.primary}
                onPress={() => setThemeMode('system')}
            />
            <ListItem
                icon="white-balance-sunny"
                title="Mode Clair"
                showChevron={false}
                badge={mode === 'light' ? 'Activé' : undefined}
                badgeColor={colors.primary}
                onPress={() => setThemeMode('light')}
            />
            <ListItem
                icon="moon-waning-crescent"
                title="Mode Sombre"
                showChevron={false}
                badge={mode === 'dark' ? 'Activé' : undefined}
                badgeColor={colors.primary}
                onPress={() => setThemeMode('dark')}
                isLast
            />
        </View>

        <View style={[styles.infoBox, { backgroundColor: isDark ? '#1E1E1E' : '#F8F9FA', borderColor: colors.border }]}>
            <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.infoBoxText, { color: colors.textSecondary }]}>
                Le mode Système adaptera automatiquement l'apparence de l'application en fonction des paramètres de votre téléphone.
            </Text>
        </View>
    </Animated.View>
);

const PersonalInfoEditView = ({ user, colors, onUpdate, fadeAnim, setCurrentView }: any) => {
    const [editName, setEditName] = useState(user?.name || '');
    const [editCity, setEditCity] = useState(user?.city || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        if (!editName.trim() || !editCity.trim()) {
            Alert.alert('Erreur', 'Le nom et la ville sont obligatoires.');
            return;
        }

        setIsUpdating(true);
        try {
            const response = await authService.updateProfile(editName, editCity);
            if (response.success) {
                onUpdate(response.user);
                Alert.alert('Succès', 'Profil mis à jour avec succès.');
                setCurrentView('menu');
            }
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Échec de la mise à jour');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            <SubViewHeader title="Modifier mon profil" onBack={() => setCurrentView('personal_info')} />

            <View style={styles.editFormContainer}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Nom complet</Text>
                <View style={[styles.editInputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <TextInput
                        style={[styles.editInput, { color: colors.textPrimary }]}
                        value={editName}
                        onChangeText={setEditName}
                        placeholder="Votre nom"
                        placeholderTextColor={colors.disabled}
                    />
                </View>

                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Ville</Text>
                <CityPicker
                    value={editCity}
                    onSelect={setEditCity}
                    placeholder="Sélectionnez votre ville"
                />

                <TouchableOpacity
                    style={[
                        styles.saveChangesButton,
                        { backgroundColor: colors.brand },
                        (!editName.trim() || !editCity.trim() || isUpdating) && { backgroundColor: colors.disabled }
                    ]}
                    onPress={handleUpdate}
                    disabled={!editName.trim() || !editCity.trim() || isUpdating}
                >
                    {isUpdating ? (
                        <ActivityIndicator color={colors.textOnPrimary} size="small" />
                    ) : (
                        <Text style={[styles.saveChangesText, { color: colors.textOnPrimary }]}>Enregistrer les modifications</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 24 }]}>
                <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoBoxText, { color: colors.textSecondary }]}>
                    Le numéro de téléphone est lié à votre compte et ne peut pas être modifié directement.
                </Text>
            </View>
        </Animated.View>
    );
};

export default function ProfileScreen({
    onNavigate,
    onLogout,
    onAuthAction
}: {
    onNavigate?: (route: string) => void;
    onLogout?: () => void;
    onAuthAction?: (action: 'login' | 'register') => void;
}) {
    const { colors, spacing, textStyles, mode, setThemeMode, isDark } = useTheme();
    const [currentView, setCurrentView] = useState<SubView>('menu');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await authService.getUser();
            setUser(userData);
        };
        loadUser();
    }, []);

    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [currentView]);

    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Êtes-vous sûr de vouloir vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Déconnexion",
                    style: "destructive",
                    onPress: () => onLogout?.()
                }
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
            {currentView === 'menu' && (
                !user ? (
                    <UnauthenticatedView
                        colors={colors}
                        onAuthAction={onAuthAction}
                        onNavigate={onNavigate}
                        mode={mode}
                        setCurrentView={setCurrentView}
                        fadeAnim={fadeAnim}
                    />
                ) : (
                    <MenuView
                        user={user}
                        colors={colors}
                        spacing={spacing}
                        setCurrentView={setCurrentView}
                        mode={mode}
                        onNavigate={onNavigate}
                        handleLogout={handleLogout}
                        fadeAnim={fadeAnim}
                    />
                )
            )}
            {currentView === 'personal_info' && (
                <PersonalInfoDetailView
                    user={user}
                    colors={colors}
                    setCurrentView={setCurrentView}
                    fadeAnim={fadeAnim}
                />
            )}
            {currentView === 'edit_profile' && (
                <PersonalInfoEditView
                    user={user}
                    colors={colors}
                    onUpdate={setUser}
                    fadeAnim={fadeAnim}
                    setCurrentView={setCurrentView}
                />
            )}
            {currentView === 'theme_selector' && (
                <ThemeSelectorView
                    colors={colors}
                    isDark={isDark}
                    mode={mode}
                    setThemeMode={setThemeMode}
                    setCurrentView={setCurrentView}
                    fadeAnim={fadeAnim}
                />
            )}
            {currentView === 'phone_change' && (
                <PhoneChangeView
                    user={user}
                    colors={colors}
                    setCurrentView={setCurrentView}
                    fadeAnim={fadeAnim}
                />
            )}
            {currentView === 'security' && (
                <SecurityView
                    colors={colors}
                    setCurrentView={setCurrentView}
                    fadeAnim={fadeAnim}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingTop: 16, // Use numbers as fallback or spacing tokens if available globally
        paddingBottom: 40,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        marginHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 20,
        borderBottomWidth: 1,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    headerInfo: {
        marginLeft: 16,
        flex: 1,
    },
    fullName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    phoneNumberText: {
        fontSize: 12,
    },
    sectionHeader: {
        fontSize: 11,
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 8,
        letterSpacing: 1,
        fontWeight: '600',
    },
    listContainer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    listItemTitle: {
        fontSize: 16,
        marginLeft: 16,
        flex: 1,
    },
    listItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    listItemValue: {
        fontSize: 14, // Slightly larger for better readability
        marginRight: 4,
    },
    inlineBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    inlineBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        marginLeft: 56,
    },
    subViewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    subViewTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    card: {
        margin: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardHeaderInfo: {
        marginLeft: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 12,
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 22,
    },
    stepsContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    stepsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    infoBox: {
        flexDirection: 'row',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
    },
    infoBoxText: {
        fontSize: 12,
        flex: 1,
    },
    modifyAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        gap: 8,
        padding: 16,
    },
    modifyActionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
    },
    footer: {
        alignItems: 'center',
        marginTop: 24,
        paddingBottom: 24,
    },
    version: {
        fontSize: 10,
    },
    unauthContainer: {
        flex: 1,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 500,
    },
    unauthIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    unauthTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    unauthSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 40,
        opacity: 0.7,
    },
    authButton: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    authButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    authButtonOutline: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    authButtonTextOutline: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    editFormContainer: {
        padding: 16,
    },
    editLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    editInputWrapper: {
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        marginBottom: 20,
        justifyContent: 'center',
    },
    editInput: {
        fontSize: 16,
    },
    saveChangesButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    saveChangesText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    currentPhone: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        marginTop: 8,
    },
    submitButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
