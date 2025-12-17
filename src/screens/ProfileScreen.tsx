/**
 * Profile Screen - Settings style
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, textStyles } from '../theme';

interface SettingsItem {
    id: number;
    title: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress: () => void;
    danger?: boolean;
}

interface SettingsSection {
    title: string;
    items: SettingsItem[];
}

export default function ProfileScreen() {
    const sections: SettingsSection[] = [
        {
            title: 'Compte',
            items: [
                {
                    id: 1,
                    title: 'Informations personnelles',
                    icon: 'account-circle-outline',
                    onPress: () => console.log('Personal info'),
                },
                {
                    id: 2,
                    title: 'Adresses',
                    icon: 'map-marker-outline',
                    onPress: () => console.log('Addresses'),
                },
                {
                    id: 3,
                    title: 'Méthodes de paiement',
                    icon: 'credit-card-outline',
                    onPress: () => console.log('Payment methods'),
                },
            ],
        },
        {
            title: 'Préférences',
            items: [
                {
                    id: 4,
                    title: 'Notifications',
                    icon: 'bell-outline',
                    onPress: () => console.log('Notifications'),
                },
                {
                    id: 5,
                    title: 'Langue',
                    icon: 'translate',
                    onPress: () => console.log('Language'),
                },
                {
                    id: 6,
                    title: 'Sécurité',
                    icon: 'shield-lock-outline',
                    onPress: () => console.log('Security'),
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    id: 7,
                    title: 'Centre d\'aide',
                    icon: 'help-circle-outline',
                    onPress: () => console.log('Help'),
                },
                {
                    id: 8,
                    title: 'Nous contacter',
                    icon: 'email-outline',
                    onPress: () => console.log('Contact'),
                },
                {
                    id: 9,
                    title: 'Conditions d\'utilisation',
                    icon: 'file-document-outline',
                    onPress: () => console.log('Terms'),
                },
            ],
        },
        {
            title: 'Actions',
            items: [
                {
                    id: 10,
                    title: 'Déconnexion',
                    icon: 'logout',
                    onPress: () => console.log('Logout'),
                    danger: true,
                },
            ],
        },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <MaterialCommunityIcons name="account" size={50} color={colors.textOnPrimary} />
                    </View>
                </View>
                <Text style={styles.userName}>Utilisateur SALA</Text>
                <Text style={styles.userEmail}>utilisateur@sala.com</Text>

                {/* Edit Profile Button */}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => console.log('Edit profile')}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="pencil" size={18} color={colors.textOnPrimary} />
                    <Text style={styles.editButtonText}>Modifier le profil</Text>
                </TouchableOpacity>
            </View>

            {/* Settings Sections */}
            {sections.map((section, index) => (
                <View key={index} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <View style={styles.sectionCard}>
                        {section.items.map((item, itemIndex) => (
                            <React.Fragment key={item.id}>
                                <TouchableOpacity
                                    style={styles.settingsItem}
                                    onPress={item.onPress}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.itemLeft}>
                                        <MaterialCommunityIcons
                                            name={item.icon}
                                            size={24}
                                            color={item.danger ? colors.error : colors.primary}
                                        />
                                        <Text style={[
                                            styles.itemText,
                                            item.danger && styles.itemTextDanger
                                        ]}>
                                            {item.title}
                                        </Text>
                                    </View>
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={20}
                                        color={colors.textSecondary}
                                    />
                                </TouchableOpacity>
                                {itemIndex < section.items.length - 1 && <View style={styles.divider} />}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            ))}

            <View style={styles.footer}>
                <Text style={styles.version}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.base,
        paddingBottom: spacing.xxxl,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        marginBottom: spacing.base,
    },
    avatarContainer: {
        marginBottom: spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.surface,
    },
    userName: {
        ...textStyles.h2,
        color: colors.brand,
        marginBottom: spacing.xs,
    },
    userEmail: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginBottom: spacing.base,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.accent,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 20,
        gap: spacing.xs,
        marginTop: spacing.sm,
    },
    editButtonText: {
        ...textStyles.bodyBold,
        color: colors.textOnPrimary,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...textStyles.sectionTitle,
        color: colors.brand,
        marginBottom: spacing.sm,
        marginHorizontal: spacing.xs,
    },
    sectionCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.base,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemText: {
        ...textStyles.body,
        color: colors.textPrimary,
        marginLeft: spacing.md,
    },
    itemTextDanger: {
        color: colors.error,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: spacing.base,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    version: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
});
