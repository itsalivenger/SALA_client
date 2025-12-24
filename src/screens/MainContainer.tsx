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
import NotificationsScreen from '../screens/NotificationsScreen';
import LanguageScreen from '../screens/LanguageScreen';
import SupportScreen from '../screens/SupportScreen';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme';

import SalaServiceScreen from '../screens/SalaServiceScreen';

type TabName = 'Accueil' | 'Historique' | 'Profil';
type SubRoute = 'SalaServices' | 'Notifications' | 'Language' | 'Support' | null;

interface MainContainerProps {
    onLogout: () => void;
    onAuthAction: (action: 'login' | 'register') => void;
}

export default function MainContainer({ onLogout, onAuthAction }: MainContainerProps) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState<TabName>('Accueil');
    const [subRoute, setSubRoute] = useState<SubRoute>(null);

    // Reset subRoute when changing tabs
    const handleTabPress = (tab: string) => {
        setActiveTab(tab as TabName);
        setSubRoute(null);
    };

    const renderScreen = () => {
        // Handle sub-routes first (overlays on current tab)
        if (activeTab === 'Accueil' && subRoute === 'SalaServices') {
            return <SalaServiceScreen onBack={() => setSubRoute(null)} />;
        }

        if (activeTab === 'Profil') {
            if (subRoute === 'Notifications') return <NotificationsScreen onBack={() => setSubRoute(null)} />;
            if (subRoute === 'Language') return <LanguageScreen onBack={() => setSubRoute(null)} />;
            if (subRoute === 'Support') return <SupportScreen onBack={() => setSubRoute(null)} />;
        }

        switch (activeTab) {
            case 'Accueil':
                return <HomeScreen onNavigate={(route) => setSubRoute(route as SubRoute)} />;
            case 'Historique':
                return <HistoryScreen />;
            case 'Profil':
                return (
                    <ProfileScreen
                        onNavigate={(route) => setSubRoute(route as SubRoute)}
                        onLogout={onLogout}
                        onAuthAction={onAuthAction}
                    />
                );
            default:
                return <HomeScreen onNavigate={(route) => setSubRoute(route as SubRoute)} />;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.screenContainer}>
                {renderScreen()}
            </View>
            <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    screenContainer: {
        flex: 1,
    },
});
