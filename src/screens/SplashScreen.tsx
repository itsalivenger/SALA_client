/**
 * Splash Screen
 * Initial screen with SALA logo, auto-navigates to welcome
 */

import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme';


interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const { colors } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Subtle fade-in animation for logo
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            onFinish();
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
    }, [onFinish, fadeAnim]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View style={{ opacity: fadeAnim }}>
                <Image
                    source={require('../../assets/home_sala_noBg.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        width: 180,
        height: 180,
    },
});


