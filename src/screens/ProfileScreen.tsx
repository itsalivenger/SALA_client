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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import type { ThemeMode } from '../theme';
import { authService } from '../services/authService';



// Types
type AccountStatus = 'pending' | 'approved' | 'suspended';
type SubView = 'menu' | 'status' | 'documents' | 'personal_info' | 'theme_selector';


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

    const renderUnauthenticated = () => (
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

            {/* App Settings available even when logged out */}
            <Text style={[styles.sectionHeader, { color: colors.textSecondary, marginTop: 48 }]}>PARAMÈTRES DE L'APP</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ListItem icon="translate" title="Langue" value="Français" onPress={() => onNavigate?.('Language')} />
                <ListItem
                    icon="theme-light-dark"
                    title="Thème"
                    value={mode === 'system' ? 'Système' : mode === 'dark' ? 'Sombre' : 'Clair'}
                    onPress={() => setCurrentView('theme_selector')}
                    isLast
                />
            </View>
        </Animated.View>
    );

    const renderMenu = () => {
        if (!user) return renderUnauthenticated();

        return (
            <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={[styles.screenTitle, { color: colors.brand }]}>Profil</Text>

                {/* Header - Clickable to Personal Info */}
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

                {/* Account Settings Group */}
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
                        onPress={() => { }}
                        isLast
                    />
                </View>

                {/* App Settings */}
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
                    <ListItem icon="file-document-outline" title="Documents légaux" onPress={() => { }} />
                    <ListItem icon="headphones" title="Support & Contact" onPress={() => onNavigate?.('Support')} isLast />
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
    };



    const renderThemeSelectorView = () => (
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

    const renderPersonalInfoView = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <SubViewHeader title="Informations personnelles" onBack={() => setCurrentView('menu')} />

            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ListItem icon="phone-outline" title="Téléphone" value={user?.phoneNumber || ''} showChevron={false} />
                <ListItem icon="map-marker-outline" title="Ville" value={user?.city || 'Non renseignée'} showChevron={false} isLast />
            </View>

            <TouchableOpacity
                style={styles.modifyAction}
                onPress={() => Alert.alert("Modification", "Veuillez contacter le support pour modifier vos informations personnelles.")}
            >
                <MaterialCommunityIcons name="pencil-outline" size={24} color={colors.accent} />
                <Text style={[styles.modifyActionText, { color: colors.accent }]}>Demander une modification</Text>
            </TouchableOpacity>
        </Animated.View>
    );


    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
            {currentView === 'menu' && renderMenu()}
            {currentView === 'personal_info' && renderPersonalInfoView()}
            {currentView === 'theme_selector' && renderThemeSelectorView()}
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
});
