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
import { useTheme } from '../theme';

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
    titleColor,
    iconColor,
    badge,
    badgeColor,
    isLast = false
}: SupportItemProps) => {
    const { colors } = useTheme();
    const finalTitleColor = titleColor || colors.textPrimary;
    const finalIconColor = iconColor || colors.textSecondary;

    return (
        <>
            <TouchableOpacity
                style={styles.itemRow}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View style={styles.itemLeft}>
                    <MaterialCommunityIcons name={icon} size={22} color={finalIconColor} />
                    <View style={styles.itemTextContent}>
                        <Text style={[styles.itemTitle, { color: finalTitleColor }]}>{title}</Text>
                        {subtitle && <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
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
            {!isLast && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
        </>
    );
};


export default function SupportScreen({ onBack }: { onBack: () => void }) {
    const { colors, spacing, textStyles, isDark } = useTheme();
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
            <Text style={[styles.sectionHeader, { color: colors.brand }]}>CANAUX DE CONTACT</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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


            <Text style={[styles.sectionHeader, { color: colors.brand }]}>AIDE & INFORMATIONS</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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


            <Text style={[styles.sectionHeader, { color: colors.brand }]}>LÉGAL</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>SALA Pro • Application Officielle</Text>
                <Text style={[styles.footerSub, { color: colors.disabled }]}>ID App: 82.1.0.452</Text>
            </View>

        </ScrollView>
    );

    const renderTopicSelection = () => (
        <View style={[styles.topicContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>Quel est l'objet de votre demande ?</Text>
            <Text style={[styles.topicSubtitle, { color: colors.textSecondary }]}>
                Sélectionnez une catégorie pour nous aider à traiter votre demande plus rapidement.
            </Text>

            <View style={styles.topicGrid}>
                <TouchableOpacity
                    style={[styles.topicButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => handleTopicSelect('Réclamations')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.error + '10' }]}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={32} color={colors.error} />
                    </View>
                    <Text style={[styles.topicLabel, { color: colors.textPrimary }]}>Réclamations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.topicButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => handleTopicSelect('Question')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.brand + '10' }]}>
                        <MaterialCommunityIcons name="help-rhombus-outline" size={32} color={colors.brand} />
                    </View>
                    <Text style={[styles.topicLabel, { color: colors.textPrimary }]}>Question</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.topicButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => handleTopicSelect('Autres')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.disabled + '20' }]}>
                        <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={32} color={colors.textSecondary} />
                    </View>
                    <Text style={[styles.topicLabel, { color: colors.textPrimary }]}>Autres</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.cancelTopic}
                onPress={() => setCurrentView('main')}
            >
                <Text style={[styles.cancelTopicText, { color: colors.textSecondary }]}>Annuler</Text>
            </TouchableOpacity>
        </View>

    );

    const renderFormView = () => (
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <Text style={[styles.formTitle, { color: colors.brand }]}>{selectedTopic}</Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
                Veuillez fournir les détails ci-dessous.
            </Text>

            <View style={styles.inputGroup}>
                {selectedTopic === 'Réclamations' ? (
                    <>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>N° de commande (Optionnel)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
                            placeholder="Ex: #ORD-12345"
                            value={orderId}
                            onChangeText={setOrderId}
                            placeholderTextColor={colors.disabled}
                        />
                    </>
                ) : (
                    <>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Sujet *</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
                            placeholder="L'objet de votre demande"
                            value={subject}
                            onChangeText={setSubject}
                            placeholderTextColor={colors.disabled}
                        />
                    </>
                )}

                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Message *</Text>
                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
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
                style={[styles.submitButton, { backgroundColor: colors.brand }, isSubmitting && [styles.submitButtonDisabled, { backgroundColor: colors.disabled }]]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <Text style={[styles.submitButtonText, { color: colors.surface }]}>
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelLink}
                onPress={() => setCurrentView('topics')}
            >
                <Text style={[styles.cancelLinkText, { color: colors.textSecondary }]}>Changer d'objet</Text>
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backButton}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.brand }]}>
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        paddingTop: 32,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    content: {
        paddingBottom: 48,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 8,
        letterSpacing: 1,
    },
    listContainer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingVertical: 24,
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
        marginRight: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    itemTextContent: {
        marginLeft: 12,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        height: 1,
        marginLeft: 16,
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: 48,
        marginBottom: 24,
    },
    footerText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    footerSub: {
        fontSize: 12,
        marginTop: 4,
    },
    topicContent: {
        flex: 1,
        padding: 16,
    },
    topicTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
        textAlign: 'center',
    },
    topicSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 32,
    },
    topicGrid: {
        gap: 12,
    },
    topicButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
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
        marginRight: 24,
    },
    topicLabel: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    cancelTopic: {
        marginTop: 48,
        alignItems: 'center',
        padding: 16,
    },
    cancelTopicText: {
        fontWeight: 'bold',
    },
    formContainer: {
        padding: 16,
        paddingBottom: 48,
    },
    formTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
    },
    formSubtitle: {
        fontSize: 16,
        marginBottom: 24,
    },
    inputGroup: {
        gap: 16,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    textArea: {
        minHeight: 120,
    },
    submitButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonDisabled: {
    },
    submitButtonText: {
        fontWeight: 'bold',
    },
    cancelLink: {
        alignItems: 'center',
        marginTop: 16,
        padding: 8,
    },
    cancelLinkText: {
        fontSize: 12,
        textDecorationLine: 'underline',
    }
});
