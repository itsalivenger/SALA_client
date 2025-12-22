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
    TextInput,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, textStyles } from '../theme';
import { APP_LINKS } from '../config/links';

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
    const [currentView, setCurrentView] = React.useState<'main' | 'topics' | 'form'>('main');
    const [selectedTopic, setSelectedTopic] = React.useState<'Réclamations' | 'Question' | 'Autres' | null>(null);

    // Form fields state
    const [subject, setSubject] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [orderId, setOrderId] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handlePress = (title: string) => {
        switch (title) {
            case 'Support Form':
                setCurrentView('topics');
                break;
            case 'FAQ':
                Linking.openURL(APP_LINKS.faq);
                break;
            case 'Rules':
                Linking.openURL(APP_LINKS.rules);
                break;
            case 'Terms':
                Linking.openURL(APP_LINKS.terms);
                break;
            case 'Privacy':
                Linking.openURL(APP_LINKS.privacy);
                break;
            default:
                console.log(`Pressed: ${title}`);
        }
    };

    const handleTopicSelect = (topic: 'Réclamations' | 'Question' | 'Autres') => {
        setSelectedTopic(topic);
        setCurrentView('form');
        // Reset fields
        setSubject('');
        setMessage('');
        setOrderId('');
    };

    const handleSubmit = () => {
        if (!message || (selectedTopic !== 'Réclamations' && !subject)) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert(
                'Succès',
                'Votre demande a été envoyée avec succès. Notre équipe vous répondra dans les plus brefs délais.',
                [{ text: 'OK', onPress: () => setCurrentView('main') }]
            );
        }, 1500);
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
                    onPress={() => handleTopicSelect('Réclamations')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.error + '10' }]}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={32} color={colors.error} />
                    </View>
                    <Text style={styles.topicLabel}>Réclamations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.topicButton}
                    onPress={() => handleTopicSelect('Question')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.brand + '10' }]}>
                        <MaterialCommunityIcons name="help-rhombus-outline" size={32} color={colors.brand} />
                    </View>
                    <Text style={styles.topicLabel}>Question</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.topicButton}
                    onPress={() => handleTopicSelect('Autres')}
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

    const renderFormView = () => (
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.formTitle}>{selectedTopic}</Text>
            <Text style={styles.formSubtitle}>
                Veuillez fournir les détails ci-dessous.
            </Text>

            <View style={styles.inputGroup}>
                {selectedTopic === 'Réclamations' ? (
                    <>
                        <Text style={styles.inputLabel}>N° de commande (Optionnel)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: #ORD-12345"
                            value={orderId}
                            onChangeText={setOrderId}
                            placeholderTextColor={colors.disabled}
                        />
                    </>
                ) : (
                    <>
                        <Text style={styles.inputLabel}>Sujet *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="L'objet de votre demande"
                            value={subject}
                            onChangeText={setSubject}
                            placeholderTextColor={colors.disabled}
                        />
                    </>
                )}

                <Text style={styles.inputLabel}>Message *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Décrivez votre demande en détail..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    placeholderTextColor={colors.disabled}
                />
            </View>

            <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelLink}
                onPress={() => setCurrentView('topics')}
            >
                <Text style={styles.cancelLinkText}>Changer d'objet</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const handleBack = () => {
        if (currentView === 'form') {
            setCurrentView('topics');
        } else if (currentView === 'topics') {
            setCurrentView('main');
        } else {
            onBack();
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backButton}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {currentView === 'topics' ? 'Objet du contact' : currentView === 'form' ? 'Nouveau ticket' : 'Support & Contact'}
                </Text>
            </View>

            {currentView === 'main' ? renderMainView() : currentView === 'topics' ? renderTopicSelection() : renderFormView()}
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
    },
    formContainer: {
        padding: spacing.base,
        paddingBottom: spacing.xxxl,
    },
    formTitle: {
        ...textStyles.h2,
        color: colors.brand,
        marginTop: spacing.md,
    },
    formSubtitle: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
    },
    inputGroup: {
        gap: spacing.base,
    },
    inputLabel: {
        ...textStyles.label,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.base,
        color: colors.textPrimary,
        ...textStyles.body,
    },
    textArea: {
        minHeight: 120,
    },
    submitButton: {
        backgroundColor: colors.brand,
        padding: spacing.base,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    submitButtonDisabled: {
        backgroundColor: colors.disabled,
    },
    submitButtonText: {
        ...textStyles.bodyBold,
        color: colors.surface,
    },
    cancelLink: {
        alignItems: 'center',
        marginTop: spacing.base,
        padding: spacing.sm,
    },
    cancelLinkText: {
        ...textStyles.label,
        color: colors.textSecondary,
        textDecorationLine: 'underline',
    }
});
