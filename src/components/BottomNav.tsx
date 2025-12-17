/**
 * Custom Bottom Navigation Bar
 * Simple tab bar with MaterialCommunityIcons
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, textStyles } from '../theme';

type TabName = 'Accueil' | 'Historique' | 'Profil';

interface TabConfig {
    name: TabName;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface BottomNavProps {
    activeTab: TabName;
    onTabPress: (tab: TabName) => void;
}

export default function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
    const insets = useSafeAreaInsets();

    const tabs: TabConfig[] = [
        { name: 'Accueil', icon: 'home-outline' },
        { name: 'Historique', icon: 'history' },
        { name: 'Profil', icon: 'account-outline' },
    ];

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                const iconColor = isActive ? colors.primary : colors.textSecondary;

                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.tab}
                        onPress={() => onTabPress(tab.name)}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name={tab.icon}
                            size={24}
                            color={iconColor}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                isActive && styles.activeTabText,
                            ]}
                        >
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    tabText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        fontWeight: '500',
        fontSize: 11,
        marginTop: 4,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: '600',
    },
});
