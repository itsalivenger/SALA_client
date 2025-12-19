/**
 * Language Screen - SALA Pro
 * Simple localization control.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, textStyles } from '../theme';

interface LanguageOption {
    id: string;
    label: string;
    native: string;
}

const LANGUAGES: LanguageOption[] = [
    { id: 'fr', label: 'Français', native: 'Français' },
    { id: 'ar', label: 'Arabe', native: 'العربية' },
    { id: 'en', label: 'Anglais', native: 'English' },
];

export default function LanguageScreen({ onBack }: { onBack: () => void }) {
    const [selectedId, setSelectedId] = useState('fr');

    const handleSelect = (id: string) => {
        setSelectedId(id);
        // Change logic would go here
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Langue</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoSection}>
                    <Text style={styles.infoText}>
                        Choisissez votre langue préférée pour l'interface de l'application.
                        Certains changements peuvent nécessiter un redémarrage.
                    </Text>
                </View>

                <View style={styles.listContainer}>
                    {LANGUAGES.map((lang, index) => {
                        const isSelected = selectedId === lang.id;
                        return (
                            <React.Fragment key={lang.id}>
                                <TouchableOpacity
                                    style={[
                                        styles.langRow,
                                        isSelected && styles.langRowSelected
                                    ]}
                                    onPress={() => handleSelect(lang.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.langInfo}>
                                        <Text style={[
                                            styles.langLabel,
                                            isSelected && styles.langLabelSelected
                                        ]}>
                                            {lang.label}
                                        </Text>
                                        <Text style={styles.langNative}>{lang.native}</Text>
                                    </View>
                                    {isSelected && (
                                        <MaterialCommunityIcons
                                            name="check-circle"
                                            size={24}
                                            color={colors.brand}
                                        />
                                    )}
                                </TouchableOpacity>
                                {index < LANGUAGES.length - 1 && <View style={styles.divider} />}
                            </React.Fragment>
                        );
                    })}
                </View>

                <View style={styles.footerNote}>
                    <MaterialCommunityIcons name="information-outline" size={16} color={colors.disabled} />
                    <Text style={styles.footerNoteText}>L'application redémarrera si nécessaire</Text>
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
        paddingVertical: spacing.xl,
    },
    infoSection: {
        paddingHorizontal: spacing.base,
        marginBottom: spacing.xl,
    },
    infoText: {
        ...textStyles.body,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    listContainer: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    langRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.base,
        paddingVertical: spacing.xl,
    },
    langRowSelected: {
        backgroundColor: colors.brand + '05',
    },
    langInfo: {
        flex: 1,
    },
    langLabel: {
        ...textStyles.bodyBold,
        color: colors.textPrimary,
        fontSize: 17,
    },
    langLabelSelected: {
        color: colors.brand,
    },
    langNative: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.base,
    },
    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xxl,
        gap: 6,
    },
    footerNoteText: {
        ...textStyles.label,
        color: colors.disabled,
    }
});
