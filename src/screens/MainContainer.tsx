/**
 * Main Container with Bottom Navigation
 * Manages tab switching and displays appropriate screen
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme';

type TabName = 'Accueil' | 'Historique' | 'Profil';

export default function MainContainer() {
    const [activeTab, setActiveTab] = useState<TabName>('Accueil');

    const renderScreen = () => {
        switch (activeTab) {
            case 'Accueil':
                return <HomeScreen />;
            case 'Historique':
                return <HistoryScreen />;
            case 'Profil':
                return <ProfileScreen />;
            default:
                return <HomeScreen />;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.screenContainer}>
                {renderScreen()}
            </View>
            <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    screenContainer: {
        flex: 1,
    },
});
