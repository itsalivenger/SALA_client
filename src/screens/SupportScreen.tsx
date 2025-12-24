import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    TextInput,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { APP_LINKS } from '../config/links';
import { authService } from '../services/authService';

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
    const { colors, spacing } = useTheme();
    const [currentView, setCurrentView] = useState<'main' | 'topics' | 'form' | 'reclamations' | 'chat'>('main');
    const [selectedTopic, setSelectedTopic] = useState<'Réclamation' | 'Plaintes' | 'Questions' | 'Autres' | null>(null);
    const [reclamations, setReclamations] = useState<any[]>([]);
    const [selectedReclamation, setSelectedReclamation] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    // Form fields state
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [orderId, setOrderId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [chatMessage, setChatMessage] = useState('');

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (currentView === 'reclamations') {
            fetchReclamations();
        }
    }, [currentView]);

    const fetchReclamations = async () => {
        setLoading(true);
        try {
            const response = await authService.getReclamations();
            if (response.success) {
                setReclamations(response.reclamations);
            }
        } catch (error) {
            console.error('[SUPPORT] Fetch reclamations error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTopicSelect = (topic: 'Réclamation' | 'Plaintes' | 'Questions' | 'Autres') => {
        setSelectedTopic(topic);
        setCurrentView('form');
        setSubject('');
        setMessage('');
        setOrderId('');
    };

    const handleSubmit = async () => {
        if (!message || (selectedTopic !== 'Réclamation' && !subject)) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authService.createReclamation(selectedTopic!, subject, message, orderId);
            if (response.success) {
                Alert.alert(
                    'Succès',
                    'Votre demande a été envoyée avec succès.',
                    [{ text: 'OK', onPress: () => setCurrentView('reclamations') }]
                );
            } else {
                Alert.alert('Erreur', response.message || 'Impossible de créer la réclamation.');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;

        try {
            const response = await authService.sendReclamationMessage(selectedReclamation._id, chatMessage.trim());
            if (response.success) {
                setSelectedReclamation(response.reclamation);
                setChatMessage('');
                // Optimized scrolling would be better, but ScrollView works here
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible d\'envoyer le message.');
        }
    };

    const renderMainView = () => (
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={[styles.sectionHeader, { color: colors.brand }]}>CANAUX DE CONTACT</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <SupportItem
                    icon="message-outline"
                    title="Contacter le support"
                    subtitle="Ouverture d'une réclamation"
                    titleColor={colors.accent}
                    iconColor={colors.accent}
                    showExternal={false}
                    onPress={() => setCurrentView('topics')}
                    isLast
                />
            </View>

            <Text style={[styles.sectionHeader, { color: colors.brand }]}>SUIVI</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <SupportItem
                    icon="alert-decagram-outline"
                    title="Gestion des plaintes"
                    subtitle="Historique et suivis des litiges"
                    badge={reclamations.length > 0 ? reclamations.length.toString() : undefined}
                    badgeColor={colors.accent}
                    showExternal={false}
                    onPress={() => setCurrentView('reclamations')}
                    isLast
                />
            </View>

            <Text style={[styles.sectionHeader, { color: colors.brand }]}>AIDE</Text>
            <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <SupportItem
                    icon="help-circle-outline"
                    title="FAQ / Centre d'aide"
                    subtitle="Réponses aux questions fréquentes"
                    onPress={() => Linking.openURL(APP_LINKS.faq)}
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
                Sélectionnez une catégorie pour nous aider à traiter votre demande.
            </Text>

            <View style={styles.topicGrid}>
                <TouchableOpacity
                    style={[styles.topicButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => handleTopicSelect('Réclamation')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.error + '10' }]}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={32} color={colors.error} />
                    </View>
                    <Text style={[styles.topicLabel, { color: colors.textPrimary }]}>Réclamation</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.topicButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => handleTopicSelect('Plaintes')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.accent + '10' }]}>
                        <MaterialCommunityIcons name="alert-octagon-outline" size={32} color={colors.accent} />
                    </View>
                    <Text style={[styles.topicLabel, { color: colors.textPrimary }]}>Plaintes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.topicButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => handleTopicSelect('Questions')}
                >
                    <View style={[styles.topicIcon, { backgroundColor: colors.brand + '10' }]}>
                        <MaterialCommunityIcons name="help-rhombus-outline" size={32} color={colors.brand} />
                    </View>
                    <Text style={[styles.topicLabel, { color: colors.textPrimary }]}>Questions</Text>
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

            <TouchableOpacity style={styles.cancelTopic} onPress={() => setCurrentView('main')}>
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
                {selectedTopic === 'Réclamation' ? (
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
                style={[styles.submitButton, { backgroundColor: colors.brand }, isSubmitting && { backgroundColor: colors.disabled }]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color={colors.surface} />
                ) : (
                    <Text style={[styles.submitButtonText, { color: colors.surface }]}>Envoyer</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelLink} onPress={() => setCurrentView('topics')}>
                <Text style={[styles.cancelLinkText, { color: colors.textSecondary }]}>Changer d'objet</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderReclamationsList = () => (
        <View style={{ flex: 1 }}>
            {loading ? (
                <View style={styles.centerLoading}>
                    <ActivityIndicator size="large" color={colors.brand} />
                </View>
            ) : reclamations.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="ticket-outline" size={64} color={colors.disabled} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Aucune plainte trouvée.</Text>
                    <TouchableOpacity
                        style={[styles.authButton, { backgroundColor: colors.brand, marginTop: 24 }]}
                        onPress={() => setCurrentView('topics')}
                    >
                        <Text style={[styles.authButtonText, { color: colors.surface }]}>Nouvelle plainte</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={reclamations}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.reclamationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => {
                                setSelectedReclamation(item);
                                setCurrentView('chat');
                            }}
                        >
                            <View style={styles.reclamationHeader}>
                                <Text style={[styles.reclamationSubject, { color: colors.textPrimary }]} numberOfLines={1}>{item.subject}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Open' ? colors.brand + '20' : colors.disabled + '20' }]}>
                                    <Text style={[styles.statusText, { color: item.status === 'Open' ? colors.brand : colors.textSecondary }]}>
                                        {item.status === 'Open' ? 'En cours' : item.status === 'Resolved' ? 'Résolu' : item.status}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.reclamationDate, { color: colors.textSecondary }]}>
                                {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </Text>
                            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.disabled} style={styles.reclamationChevron} />
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

    const renderChatView = () => (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={{ flex: 1 }}
        >
            <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {selectedReclamation?.messages.map((msg: any, index: number) => (
                    <View
                        key={index}
                        style={[
                            styles.messageRow,
                            msg.sender === 'User' ? styles.userMessageRow : styles.supportMessageRow
                        ]}
                    >
                        <View
                            style={[
                                styles.messageBubble,
                                msg.sender === 'User'
                                    ? [styles.userBubble, { backgroundColor: colors.brand }]
                                    : [styles.supportBubble, { backgroundColor: colors.surface, borderColor: colors.border }]
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    { color: msg.sender === 'User' ? colors.surface : colors.textPrimary }
                                ]}
                            >
                                {msg.text}
                            </Text>
                            <Text
                                style={[
                                    styles.messageTime,
                                    { color: msg.sender === 'User' ? colors.surface + '80' : colors.disabled }
                                ]}
                            >
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {selectedReclamation?.status !== 'Resolved' && (
                <View style={[styles.chatInputContainer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
                    <TextInput
                        style={[styles.chatInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                        placeholder="Écrivez votre message..."
                        placeholderTextColor={colors.disabled}
                        value={chatMessage}
                        onChangeText={setChatMessage}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: colors.brand }]}
                        onPress={handleSendMessage}
                        disabled={!chatMessage.trim()}
                    >
                        <MaterialCommunityIcons name="send" size={20} color={colors.surface} />
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );

    const handleBack = () => {
        if (currentView === 'chat') {
            setCurrentView('reclamations');
        } else if (currentView === 'reclamations') {
            setCurrentView('main');
        } else if (currentView === 'form') {
            setCurrentView('topics');
        } else if (currentView === 'topics') {
            setCurrentView('main');
        } else {
            onBack();
        }
    };

    const getHeaderTitle = () => {
        switch (currentView) {
            case 'topics': return 'Objet du contact';
            case 'form': return 'Nouvelle réclamation';
            case 'reclamations': return 'Gestion des plaintes';
            case 'chat': return selectedReclamation?.subject || 'Conversation';
            default: return 'Support & Contact';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.brand }]} numberOfLines={1}>
                    {getHeaderTitle()}
                </Text>
            </View>

            {currentView === 'main' && renderMainView()}
            {currentView === 'topics' && renderTopicSelection()}
            {currentView === 'form' && renderFormView()}
            {currentView === 'reclamations' && renderReclamationsList()}
            {currentView === 'chat' && renderChatView()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        paddingTop: 32,
    },
    backButton: { padding: 8, marginLeft: -8 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 8, flex: 1 },
    content: { paddingBottom: 48 },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 8,
        letterSpacing: 1,
    },
    listContainer: { borderTopWidth: 1, borderBottomWidth: 1 },
    itemRow: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingVertical: 20 },
    itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    itemRight: { flexDirection: 'row', alignItems: 'center' },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
    badgeText: { fontSize: 10, fontWeight: 'bold' },
    itemTextContent: { marginLeft: 12 },
    itemTitle: { fontWeight: 'bold', fontSize: 16 },
    itemSubtitle: { fontSize: 12, marginTop: 2 },
    divider: { height: 1, marginLeft: 16 },
    footerInfo: { alignItems: 'center', marginTop: 48, marginBottom: 24 },
    footerText: { fontWeight: 'bold', fontSize: 12 },
    footerSub: { fontSize: 12, marginTop: 4 },
    topicContent: { flex: 1, padding: 16 },
    topicTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 24, textAlign: 'center' },
    topicSubtitle: { fontSize: 16, textAlign: 'center', marginTop: 8, marginBottom: 32 },
    topicGrid: { gap: 12 },
    topicButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
    },
    topicIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    topicLabel: { fontWeight: 'bold', fontSize: 16 },
    cancelTopic: { marginTop: 48, alignItems: 'center', padding: 16 },
    cancelTopicText: { fontWeight: 'bold' },
    formContainer: { padding: 16, paddingBottom: 48 },
    formTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
    formSubtitle: { fontSize: 14, marginBottom: 24 },
    inputGroup: { gap: 16 },
    inputLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
    input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
    textArea: { minHeight: 120 },
    submitButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    submitButtonText: { fontWeight: 'bold' },
    cancelLink: { alignItems: 'center', marginTop: 16, padding: 8 },
    cancelLinkText: { fontSize: 12, textDecorationLine: 'underline' },
    centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyText: { marginTop: 16, fontSize: 16, textAlign: 'center' },
    authButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 },
    authButtonText: { fontWeight: 'bold' },
    reclamationCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
    reclamationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    reclamationSubject: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 11, fontWeight: 'bold' },
    reclamationDate: { fontSize: 12, marginTop: 8 },
    reclamationChevron: { position: 'absolute', right: 12, bottom: 12 },
    messageRow: { flexDirection: 'row', marginBottom: 16 },
    userMessageRow: { justifyContent: 'flex-end' },
    supportMessageRow: { justifyContent: 'flex-start' },
    messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
    userBubble: { borderBottomRightRadius: 2 },
    supportBubble: { borderBottomLeftRadius: 2, borderWidth: 1 },
    messageText: { fontSize: 15 },
    messageTime: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
    chatInputContainer: { flexDirection: 'row', padding: 12, alignItems: 'flex-end', borderTopWidth: 1 },
    chatInput: { flex: 1, borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100, fontSize: 15 },
    sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
});
