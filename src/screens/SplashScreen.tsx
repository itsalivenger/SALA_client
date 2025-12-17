/**
 * Splash Screen
 * Initial screen with SALA logo, auto-navigates to onboarding
 */

import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 2500); // 2.5 seconds

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/splash_logo_sala.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
});
