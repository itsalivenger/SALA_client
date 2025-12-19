/**
 * Support & Contact Screen - SALA Pro
 * Structured access to support and legal info.
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, textStyles } from '../theme';

interface SupportItemProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showExternal?: boolean;
    titleColor?: string;
    iconColor?: string;
    badge?: string;
    badgeColor?: string;
    isLast?: boolean;
}

const SupportItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showExternal = true,
    titleColor = colors.textPrimary,
    iconColor = colors.textSecondary,
    badge,
    badgeColor,
    isLast = false
}: SupportItemProps) => (
    <>
        <TouchableOpacity
            style={styles.itemRow}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
                <View style={styles.itemTextContent}>
                    <Text style={[styles.itemTitle, { color: titleColor }]}>{title}</Text>
                    {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.itemRight}>
                {badge && (
                    <View style={[styles.badge, { backgroundColor: badgeColor ? badgeColor + '15' : colors.border }]}>
                        <Text style={[styles.badgeText, { color: badgeColor || colors.textSecondary }]}>{badge}</Text>
                    </View>
                )}
                {showExternal && (
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.disabled} />
                )}
            </View>
        </TouchableOpacity>
        {!isLast && <View style={styles.divider} />}
    </>
);

export default function SupportScreen({ onBack }: { onBack: () => void }) {
    const [currentView, setCurrentView] = React.useState<'main' | 'topics'>('main');

    const handlePress = (title: string) => {
        if (title === 'Support Form') {
            setCurrentView('topics');
        } else {
            console.log(`Pressed: ${title}`);
        }
    };

    const renderMainView = () => (
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionHeader}>CANAUX DE CONTACT</Text>
            <View style={styles.listContainer}>
                <SupportItem
                    icon="message-outline"
                    title="Contacter le support"
                    subtitle="Ouverture d'un ticket d'assistance"
                    titleColor={colors.accent}
                    iconColor={colors.accent}
                    showExternal={false}
                    onPress={() => handlePress('Support Form')}
                    isLast
                />
            </View>

            <Text style={styles.sectionHeader}>AIDE & INFORMATIONS</Text>
            <View style={styles.listContainer}>
                <SupportItem
                    icon="help-circle-outline"
                    title="FAQ / Centre d'aide"
                    subtitle="Réponses aux questions fréquentes"
                    onPress={() => handlePress('FAQ')}
                />
                <SupportItem
                    icon="alert-decagram-outline"
                    title="Gestion des plaintes"
                    subtitle="Historique et suivis des litiges"
                    badge="2"
                    badgeColor={colors.accent}
                    showExternal={false}
                    onPress={() => handlePress('Complaints')}
                />
                <SupportItem
                    icon="shield-account-outline"
                    title="Règles du Livreur"
                    subtitle="Obligations et code de conduite"
                    onPress={() => handlePress('Rules')}
                    isLast
                />
            </View>

            <Text style={styles.sectionHeader}>LÉGAL</Text>
            <View style={styles.listContainer}>
                <SupportItem
                    icon="file-document-outline"
                    title="Conditions Générales (CGU)"
                    onPress={() => handlePress('Terms')}
                />
                <SupportItem
                    icon="shield-lock-outline"
                    title="Politique de Confidentialité"
                    onPress={() => handlePress('Privacy')}
                    isLast
                />
            </View>

            <View style={styles.footerInfo}>
                <Text style={styles.footerText}>SALA Pro • Application Officielle</Text>
                <Text style={styles.footerSub}>ID App: 82.1.0.452</Text>
            </View>
        </ScrollView>
    );

    const renderTopicSelection = () => (
        <View style={styles.topicContent}>
            <Text style={styles.topicTitle}>Quel est l'objet de votre demande ?</Text>
            <Text style={styles.topicSubtitle}>
                Sélectionnez une catégorie pour nous aider à traiter votre demande plus rapidement.
            </Text>

            <View style={styles.topicGrid}>
                <TouchableOpacity
                    style={styles.topicButton}
                    onPress={() => console.log('Topic: Réclamations')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.error + '10' }]}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={32} color={colors.error} />
                    </View>
                    <Text style={styles.topicLabel}>Réclamations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.topicButton}
                    onPress={() => console.log('Topic: Question')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.brand + '10' }]}>
                        <MaterialCommunityIcons name="help-rhombus-outline" size={32} color={colors.brand} />
                    </View>
                    <Text style={styles.topicLabel}>Question</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.topicButton}
                    onPress={() => console.log('Topic: Autres')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.disabled + '20' }]}>
                        <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={32} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.topicLabel}>Autres</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.cancelTopic}
                onPress={() => setCurrentView('main')}
            >
                <Text style={styles.cancelTopicText}>Annuler</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={currentView === 'topics' ? () => setCurrentView('main') : onBack}
                    style={styles.backButton}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {currentView === 'topics' ? 'Objet du contact' : 'Support & Contact'}
                </Text>
            </View>

            {currentView === 'main' ? renderMainView() : renderTopicSelection()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.base,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingTop: spacing.lg,
    },
    backButton: {
        padding: spacing.sm,
        marginLeft: -spacing.sm,
    },
    headerTitle: {
        ...textStyles.h3,
        color: colors.brand,
        marginLeft: spacing.sm,
    },
    content: {
        paddingBottom: spacing.xxxl,
    },
    sectionHeader: {
        ...textStyles.label,
        color: colors.brand,
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
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.base,
        paddingVertical: spacing.lg,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
    badgeText: {
        ...textStyles.label,
        fontSize: 10,
        fontWeight: 'bold',
    },
    itemTextContent: {
        marginLeft: spacing.md,
    },
    itemTitle: {
        ...textStyles.bodyBold,
        fontSize: 16,
    },
    itemSubtitle: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.base,
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: spacing.xxxl,
        marginBottom: spacing.xl,
    },
    footerText: {
        ...textStyles.captionBold,
        color: colors.textSecondary,
    },
    footerSub: {
        ...textStyles.label,
        color: colors.disabled,
        marginTop: 4,
    },
    topicContent: {
        flex: 1,
        padding: spacing.base,
        backgroundColor: colors.background,
    },
    topicTitle: {
        ...textStyles.h3,
        color: colors.textPrimary,
        marginTop: spacing.lg,
        textAlign: 'center',
    },
    topicSubtitle: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.xxl,
    },
    topicGrid: {
        gap: spacing.md,
    },
    topicButton: {
        backgroundColor: colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    topicIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    topicLabel: {
        ...textStyles.bodyBold,
        fontSize: 18,
        color: colors.textPrimary,
    },
    cancelTopic: {
        marginTop: spacing.xxxl,
        alignItems: 'center',
        padding: spacing.base,
    },
    cancelTopicText: {
        ...textStyles.bodyBold,
        color: colors.textSecondary,
    }
});
