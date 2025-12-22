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


export default function ProfileScreen({ onNavigate }: { onNavigate?: (route: string) => void }) {
    const { colors, spacing, textStyles, mode, setThemeMode, isDark } = useTheme();
    const [currentView, setCurrentView] = useState<SubView>('menu');
    const [status, setStatus] = useState<AccountStatus>('pending');
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [currentView]);

    const getStatusConfig = (s: AccountStatus) => {
        switch (s) {
            case 'approved':
                return { label: 'Approuvé', color: colors.success, bg: isDark ? '#1A3326' : '#EAF7F0', icon: 'check-decagram' as const };
            case 'suspended':
                return { label: 'Suspendu', color: colors.error, bg: isDark ? '#3D1B1B' : '#FDECEC', icon: 'alert-octagon' as const };
            default:
                return { label: 'En attente', color: colors.brand, bg: isDark ? '#2D1F3D' : '#F2EBFF', icon: 'clock-outline' as const };
        }
    };

    const statusConfig = getStatusConfig(status);

    const renderMenu = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={[styles.screenTitle, { color: colors.brand }]}>Profil</Text>

            {/* Professional Header - Clickable to Personal Info */}
            <TouchableOpacity
                style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
                onPress={() => setCurrentView('personal_info')}
                activeOpacity={0.7}
            >
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <MaterialCommunityIcons name="account" size={44} color={colors.textSecondary} />
                </View>
                <View style={styles.headerInfo}>
                    <Text style={[styles.fullName, { color: colors.textPrimary }]}>Mohamed El Amrani</Text>
                    <Text style={[styles.livreurId, { color: colors.textSecondary }]}>Livreur ID: LIV-88294</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
                        {statusConfig.label}
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.disabled} style={{ marginLeft: spacing.sm }} />
            </TouchableOpacity>

            {/* Account & Compliance Group */}
            <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>COMPTE & COMPLIANCE</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ListItem
                    icon="shield-check-outline"
                    title="État du compte"
                    value={statusConfig.label}
                    badge={status === 'pending' ? 'Validation en cours' : undefined}
                    badgeColor={colors.brand}
                    onPress={() => setCurrentView('status')}
                />
                <ListItem
                    icon="account-card-outline"
                    title="Identité et documents"
                    badge="3 documents"
                    onPress={() => setCurrentView('documents')}
                />
                <ListItem
                    icon="account-outline"
                    title="Informations personnelles"
                    onPress={() => setCurrentView('personal_info')}
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

            <TouchableOpacity style={styles.logoutButton}>
                <MaterialCommunityIcons name="logout" size={20} color={colors.textSecondary} />
                <Text style={[styles.logoutText, { color: colors.textSecondary }]}>Déconnexion</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={[styles.version, { color: colors.disabled }]}>SALA Pro • v2.1.0 (Build 452)</Text>
            </View>


            {/* Hidden toggle for testing */}
            <TouchableOpacity
                style={{ height: 40, opacity: 0.05 }}
                onPress={() => setStatus(s => s === 'pending' ? 'approved' : s === 'approved' ? 'suspended' : 'pending')}
            />
        </Animated.View>
    );

    const renderStatusView = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <SubViewHeader title="État du compte" onBack={() => setCurrentView('menu')} />

            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name={statusConfig.icon} size={32} color={statusConfig.color} />
                    <View style={styles.cardHeaderInfo}>
                        <Text style={[styles.cardTitle, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Mise à jour le 12 Dec 2025</Text>
                    </View>
                </View>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                    {status === 'pending'
                        ? 'Votre dossier est actuellement en cours de vérification par nos agents de conformité. Cela prend généralement 24h à 48h.'
                        : status === 'approved'
                            ? 'Votre compte est pleinement vérifié. Vous avez accès à toutes les fonctionnalités de SALA Pro.'
                            : 'Accès restreint. Veuillez contacter le support pour résoudre les problèmes de conformité.'}
                </Text>
            </View>

            {status === 'pending' && (
                <View style={[styles.stepsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.stepsTitle, { color: colors.textSecondary }]}>Prochaines étapes</Text>
                    <ListItem icon="check-circle" iconColor={colors.success} title="Analyse des documents" showChevron={false} />
                    <ListItem icon="clock-outline" iconColor={colors.brand} title="Vérification manuelle" showChevron={false} />
                    <ListItem icon="circle-outline" iconColor={colors.disabled} title="Activation finale" showChevron={false} isLast />
                </View>
            )}
        </Animated.View>
    );

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


    const renderDocumentsView = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <SubViewHeader title="Identité et documents" onBack={() => setCurrentView('menu')} />

            <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>DOCUMENTS VALIDÉS</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ListItem
                    icon="account-card-outline"
                    title="Carte d'Identité (CIN)"
                    badge="Vérifié"
                    badgeColor={colors.success}
                    onPress={() => { }}
                />
            </View>

            <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>DOCUMENTS EN ATTENTE</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ListItem
                    icon="card-account-details-outline"
                    title="Permis de conduire"
                    value="Expire 12/2026"
                    onPress={() => { }}
                />
                <ListItem
                    icon="face-recognition"
                    title="Vérification Selfie (Liveness)"
                    badge="Action requise"
                    badgeColor={colors.brand}
                    onPress={() => { }}
                    isLast
                />
            </View>

            <View style={[styles.infoBox, { backgroundColor: isDark ? '#1E1E1E' : '#F8F9FA', borderColor: colors.border }]}>
                <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoBoxText, { color: colors.textSecondary }]}>
                    Pour mettre à jour un document expiré, veuillez contacter le support ou attendre l'approbation du document actuel.
                </Text>
            </View>
        </Animated.View>
    );


    const renderPersonalInfoView = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <SubViewHeader title="Informations personnelles" onBack={() => setCurrentView('menu')} />

            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ListItem icon="phone-outline" title="Téléphone" value="+212 6 12 34 56 78" showChevron={false} />
                <ListItem icon="email-outline" title="Email" value="m.elamrani@email.com" showChevron={false} />
                <ListItem icon="map-marker-outline" title="Ville de résidence" value="Casablanca" showChevron={false} />
                <ListItem icon="crosshairs-gps" title="Zone d'opération" value="Maarif, Gauthier" showChevron={false} isLast />
            </View>

            <TouchableOpacity
                style={styles.modifyAction}
                onPress={() => Alert.alert("Modification", "Toute modification de vos informations personnelles nécessitera une nouvelle validation de votre compte.")}
            >
                <MaterialCommunityIcons name="pencil-outline" size={24} color={colors.accent} />
                <Text style={[styles.modifyActionText, { color: colors.accent }]}>Modifier mes informations</Text>
            </TouchableOpacity>
        </Animated.View>
    );


    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
            {currentView === 'menu' && renderMenu()}
            {currentView === 'status' && renderStatusView()}
            {currentView === 'documents' && renderDocumentsView()}
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
    livreurId: {
        fontSize: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusLabel: {
        fontWeight: 'bold',
        fontSize: 10,
        textTransform: 'uppercase',
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
    },
    listItemTitle: {
        fontSize: 16,
        marginLeft: 16,
    },
    listItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemValue: {
        fontSize: 12,
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
    }
});
