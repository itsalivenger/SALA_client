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
import { colors, spacing, textStyles } from '../theme';

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

export default function NotificationsScreen({ onBack }: { onBack: () => void }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.listContainer}>
                    {MOCK_NOTIFICATIONS.map((notif, index) => (
                        <TouchableOpacity
                            key={notif.id}
                            style={[styles.itemContainer, !notif.isRead && styles.unreadBackground]}
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
                                    <Text style={styles.itemTitle}>{notif.title}</Text>
                                    {!notif.isRead && <View style={styles.unreadDot} />}
                                </View>
                                <Text style={styles.itemDescription} numberOfLines={2}>
                                    {notif.message}
                                </Text>
                                <Text style={styles.itemTime}>{notif.time}</Text>
                            </View>
                            {index < MOCK_NOTIFICATIONS.length - 1 && <View style={styles.divider} />}
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
        paddingTop: spacing.base,
        paddingBottom: spacing.xxxl,
    },
    listContainer: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: spacing.base,
        paddingVertical: spacing.lg,
    },
    unreadBackground: {
        backgroundColor: colors.brand + '05',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
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
        ...textStyles.bodyBold,
        color: colors.textPrimary,
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accent,
        marginLeft: spacing.sm,
    },
    itemDescription: {
        ...textStyles.caption,
        color: colors.textSecondary,
        lineHeight: 18,
        marginBottom: 8,
    },
    itemTime: {
        ...textStyles.label,
        fontSize: 10,
        color: colors.disabled,
    },
    divider: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 70,
        height: 1,
        backgroundColor: colors.border,
    }
});
