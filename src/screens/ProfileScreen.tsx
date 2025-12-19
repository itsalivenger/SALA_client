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
import { colors, spacing, textStyles } from '../theme';

// Types
type AccountStatus = 'pending' | 'approved' | 'suspended';
type SubView = 'menu' | 'status' | 'documents' | 'personal_info';

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
    titleColor = colors.textPrimary,
    badge,
    badgeColor,
    isLast,
    iconColor = colors.textSecondary
}: ListItemProps) => (
    <>
        <TouchableOpacity
            style={styles.listItem}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={!onPress}
        >
            <View style={styles.listItemLeft}>
                <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
                <Text style={[styles.listItemTitle, { color: titleColor }]}>{title}</Text>
            </View>
            <View style={styles.listItemRight}>
                {badge && (
                    <View style={[styles.inlineBadge, { backgroundColor: badgeColor ? badgeColor + '15' : colors.border }]}>
                        <Text style={[styles.inlineBadgeText, { color: badgeColor || colors.textSecondary }]}>{badge}</Text>
                    </View>
                )}
                {value && <Text style={styles.listItemValue}>{value}</Text>}
                {showChevron && <MaterialCommunityIcons name="chevron-right" size={20} color={colors.disabled} />}
            </View>
        </TouchableOpacity>
        {!isLast && <View style={styles.divider} />}
    </>
);

const SubViewHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <View style={styles.subViewHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
        </TouchableOpacity>
        <Text style={styles.subViewTitle}>{title}</Text>
    </View>
);

export default function ProfileScreen({ onNavigate }: { onNavigate?: (route: string) => void }) {
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
                return { label: 'Approuvé', color: colors.success, bg: '#EAF7F0', icon: 'check-decagram' as const };
            case 'suspended':
                return { label: 'Suspendu', color: colors.error, bg: '#FDECEC', icon: 'alert-octagon' as const };
            default:
                return { label: 'En attente', color: colors.brand, bg: '#F2EBFF', icon: 'clock-outline' as const };
        }
    };

    const statusConfig = getStatusConfig(status);

    const renderMenu = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.screenTitle}>Profil</Text>

            {/* Professional Header - Clickable to Personal Info */}
            <TouchableOpacity
                style={styles.header}
                onPress={() => setCurrentView('personal_info')}
                activeOpacity={0.7}
            >
                <View style={styles.avatarPlaceholder}>
                    <MaterialCommunityIcons name="account" size={44} color={colors.textSecondary} />
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.fullName}>Mohamed El Amrani</Text>
                    <Text style={styles.livreurId}>Livreur ID: LIV-88294</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
                        {statusConfig.label}
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.disabled} style={{ marginLeft: spacing.sm }} />
            </TouchableOpacity>

            {/* Account & Compliance Group */}
            <Text style={styles.sectionHeader}>COMPTE & COMPLIANCE</Text>
            <View style={styles.listContainer}>
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
            <Text style={styles.sectionHeader}>PARAMÈTRES DE L'APP</Text>
            <View style={styles.listContainer}>
                <ListItem icon="bell-outline" title="Notifications" onPress={() => onNavigate?.('Notifications')} />
                <ListItem icon="translate" title="Langue" value="Français" onPress={() => onNavigate?.('Language')} />
                <ListItem icon="file-document-outline" title="Documents légaux" onPress={() => { }} />
                <ListItem icon="headphones" title="Support & Contact" onPress={() => onNavigate?.('Support')} isLast />
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <MaterialCommunityIcons name="logout" size={20} color={colors.textSecondary} />
                <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.version}>SALA Pro • v2.1.0 (Build 452)</Text>
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

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name={statusConfig.icon} size={32} color={statusConfig.color} />
                    <View style={styles.cardHeaderInfo}>
                        <Text style={[styles.cardTitle, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                        <Text style={styles.cardSubtitle}>Mise à jour le 12 Dec 2025</Text>
                    </View>
                </View>
                <Text style={styles.cardDescription}>
                    {status === 'pending'
                        ? 'Votre dossier est actuellement en cours de vérification par nos agents de conformité. Cela prend généralement 24h à 48h.'
                        : status === 'approved'
                            ? 'Votre compte est pleinement vérifié. Vous avez accès à toutes les fonctionnalités de SALA Pro.'
                            : 'Accès restreint. Veuillez contacter le support pour résoudre les problèmes de conformité.'}
                </Text>
            </View>

            {status === 'pending' && (
                <View style={styles.stepsContainer}>
                    <Text style={styles.stepsTitle}>Prochaines étapes</Text>
                    <ListItem icon="check-circle" iconColor={colors.success} title="Analyse des documents" showChevron={false} />
                    <ListItem icon="clock-outline" iconColor={colors.brand} title="Vérification manuelle" showChevron={false} />
                    <ListItem icon="circle-outline" iconColor={colors.disabled} title="Activation finale" showChevron={false} isLast />
                </View>
            )}
        </Animated.View>
    );

    const renderDocumentsView = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <SubViewHeader title="Identité et documents" onBack={() => setCurrentView('menu')} />

            <Text style={styles.sectionHeader}>DOCUMENTS VALIDÉS</Text>
            <View style={styles.listContainer}>
                <ListItem
                    icon="account-card-outline"
                    title="Carte d'Identité (CIN)"
                    badge="Vérifié"
                    badgeColor={colors.success}
                    onPress={() => { }}
                />
            </View>

            <Text style={styles.sectionHeader}>DOCUMENTS EN ATTENTE</Text>
            <View style={styles.listContainer}>
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

            <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.infoBoxText}>
                    Pour mettre à jour un document expiré, veuillez contacter le support ou attendre l'approbation du document actuel.
                </Text>
            </View>
        </Animated.View>
    );

    const renderPersonalInfoView = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <SubViewHeader title="Informations personnelles" onBack={() => setCurrentView('menu')} />

            <View style={styles.listContainer}>
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
                <Text style={styles.modifyActionText}>Modifier mes informations</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {currentView === 'menu' && renderMenu()}
            {currentView === 'status' && renderStatusView()}
            {currentView === 'documents' && renderDocumentsView()}
            {currentView === 'personal_info' && renderPersonalInfoView()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxxl,
    },
    screenTitle: {
        ...textStyles.h2,
        color: colors.brand,
        marginBottom: spacing.base,
        marginHorizontal: spacing.base,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.base,
        backgroundColor: colors.surface,
        marginBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerInfo: {
        marginLeft: spacing.md,
        flex: 1,
    },
    fullName: {
        ...textStyles.bodyBold,
        fontSize: 18,
        color: colors.textPrimary,
    },
    livreurId: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusLabel: {
        ...textStyles.label,
        fontWeight: 'bold',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    sectionHeader: {
        ...textStyles.label,
        color: colors.textSecondary,
        marginHorizontal: spacing.base,
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
        letterSpacing: 1,
    },
    listContainer: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.base,
        backgroundColor: colors.surface,
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemTitle: {
        ...textStyles.body,
        marginLeft: spacing.md,
    },
    listItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemValue: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginRight: spacing.xs,
    },
    inlineBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
    inlineBadgeText: {
        ...textStyles.label,
        fontSize: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.huge,
    },
    subViewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.base,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: spacing.lg,
    },
    backButton: {
        padding: spacing.sm,
        marginLeft: -spacing.sm,
    },
    subViewTitle: {
        ...textStyles.h3,
        color: colors.brand,
        marginLeft: spacing.sm,
    },
    card: {
        backgroundColor: colors.surface,
        margin: spacing.base,
        padding: spacing.lg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    cardHeaderInfo: {
        marginLeft: spacing.md,
    },
    cardTitle: {
        ...textStyles.h3,
    },
    cardSubtitle: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    cardDescription: {
        ...textStyles.body,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    stepsContainer: {
        backgroundColor: colors.surface,
        marginTop: spacing.lg,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    stepsTitle: {
        ...textStyles.captionBold,
        color: colors.textSecondary,
        marginHorizontal: spacing.base,
        marginTop: spacing.base,
        marginBottom: spacing.sm,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        margin: spacing.base,
        padding: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
    },
    infoBoxText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        flex: 1,
    },
    modifyAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xxl,
        gap: spacing.sm,
        padding: spacing.base,
    },
    modifyActionText: {
        ...textStyles.bodyBold,
        color: colors.accent,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xxxl,
        gap: spacing.sm,
    },
    logoutText: {
        ...textStyles.body,
        color: colors.textSecondary,
    },
    footer: {
        alignItems: 'center',
        marginTop: spacing.xl,
        paddingBottom: spacing.xl,
    },
    version: {
        ...textStyles.label,
        color: colors.disabled,
    }
});
