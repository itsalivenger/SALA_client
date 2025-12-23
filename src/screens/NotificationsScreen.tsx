/**
 * Notifications Screen - SALA Pro
 * Operational-only notification controls.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';


// Types
interface Notification {
    id: string;
    type: 'order' | 'finance' | 'compliance' | 'app';
    title: string;
    message: string;
    time: string;
    isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'order',
        title: 'Nouvelle commande à proximité',
        message: 'Une commande de 45.00 DH est disponible à 1.2km de votre position.',
        time: 'Il y a 5 min',
        isRead: false
    },
    {
        id: '2',
        type: 'finance',
        title: 'Versement effectué',
        message: 'Votre virement de 1,240.00 DH a été traité avec succès.',
        time: 'Aujourd\'hui, 10:24',
        isRead: true
    },
    {
        id: '3',
        type: 'compliance',
        title: 'Document validé',
        message: 'Votre Carte d\'Identité (CIN) a été approuvée par nos agents.',
        time: 'Hier, 15:30',
        isRead: true
    },
    {
        id: '4',
        type: 'app',
        title: 'Mise à jour système',
        message: 'Une nouvelle version de SALA Pro est disponible. Veuillez mettre à jour pour profiter des dernières fonctionnalités.',
        time: '2 jours',
        isRead: true
    }
];

export default function NotificationsScreen({ onBack }: { onBack: () => void }) {
    const { colors, spacing, textStyles } = useTheme();

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'order': return 'moped';
            case 'finance': return 'wallet-outline';
            case 'compliance': return 'shield-check-outline';
            default: return 'bell-outline';
        }
    };

    const getTypeColor = (type: Notification['type']) => {

        switch (type) {
            case 'order': return colors.accent;
            case 'finance': return colors.success;
            case 'compliance': return colors.brand;
            default: return colors.textSecondary;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.brand }]}>Notifications</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {MOCK_NOTIFICATIONS.map((notif, index) => (
                        <TouchableOpacity
                            key={notif.id}
                            style={[styles.itemContainer, !notif.isRead && [styles.unreadBackground, { backgroundColor: colors.brand + '05' }]]}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconBox, { backgroundColor: getTypeColor(notif.type) + '15' }]}>
                                <MaterialCommunityIcons
                                    name={getTypeIcon(notif.type)}
                                    size={24}
                                    color={getTypeColor(notif.type)}
                                />
                            </View>
                            <View style={styles.textContainer}>
                                <View style={styles.titleRow}>
                                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{notif.title}</Text>
                                    {!notif.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
                                </View>
                                <Text style={[styles.itemDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                                    {notif.message}
                                </Text>
                                <Text style={[styles.itemTime, { color: colors.disabled }]}>{notif.time}</Text>
                            </View>
                            {index < MOCK_NOTIFICATIONS.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
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
        paddingTop: 16,
        paddingBottom: 48,
    },
    listContainer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 16,
        paddingVertical: 24,
    },
    unreadBackground: {
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
    itemDescription: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 8,
    },
    itemTime: {
        fontSize: 10,
    },
    divider: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 70,
        height: 1,
    }
});
