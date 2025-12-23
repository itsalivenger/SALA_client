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
import { useTheme } from '../theme';


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
    const { colors, spacing, textStyles } = useTheme();
    const [selectedId, setSelectedId] = useState('fr');


    const handleSelect = (id: string) => {
        setSelectedId(id);
        // Change logic would go here
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.brand} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.brand }]}>Langue</Text>
            </View>


            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.infoSection, { paddingHorizontal: 16, marginBottom: 24 }]}>
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        Choisissez votre langue préférée pour l'interface de l'application.
                        Certains changements peuvent nécessiter un redémarrage.
                    </Text>
                </View>


                <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {LANGUAGES.map((lang, index) => {
                        const isSelected = selectedId === lang.id;
                        return (
                            <React.Fragment key={lang.id}>
                                <TouchableOpacity
                                    style={[
                                        styles.langRow,
                                        isSelected && [styles.langRowSelected, { backgroundColor: colors.brand + '05' }]
                                    ]}
                                    onPress={() => handleSelect(lang.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.langInfo}>
                                        <Text style={[
                                            styles.langLabel,
                                            { color: colors.textPrimary },
                                            isSelected && [styles.langLabelSelected, { color: colors.brand }]
                                        ]}>
                                            {lang.label}
                                        </Text>
                                        <Text style={[styles.langNative, { color: colors.textSecondary }]}>{lang.native}</Text>
                                    </View>
                                    {isSelected && (
                                        <MaterialCommunityIcons
                                            name="check-circle"
                                            size={24}
                                            color={colors.brand}
                                        />
                                    )}
                                </TouchableOpacity>
                                {index < LANGUAGES.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                            </React.Fragment>
                        );
                    })}
                </View>


                <View style={styles.footerNote}>
                    <MaterialCommunityIcons name="information-outline" size={16} color={colors.disabled} />
                    <Text style={[styles.footerNoteText, { color: colors.disabled }]}>L'application redémarrera si nécessaire</Text>
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
        paddingVertical: 32,
    },
    infoSection: {
    },
    infoText: {
        fontSize: 16,
        lineHeight: 22,
    },
    listContainer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    langRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingVertical: 32,
    },
    langRowSelected: {
    },
    langInfo: {
        flex: 1,
    },
    langLabel: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    langLabelSelected: {
    },
    langNative: {
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        height: 1,
        marginLeft: 16,
    },
    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 48,
        gap: 6,
    },
    footerNoteText: {
        fontSize: 12,
    }
});
