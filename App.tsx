import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import OtpScreen from './src/screens/auth/OtpScreen';
import ProfileSetupScreen from './src/screens/auth/ProfileSetupScreen';
import MainContainer from './src/screens/MainContainer';
import { ThemeProvider, useTheme } from './src/theme';
import { authService } from './src/services/authService';
import { useEffect } from 'react';

type Screen = 'splash' | 'welcome' | 'login' | 'otp' | 'profile_setup' | 'main';
type AuthMode = 'login' | 'register';

function AppContent() {
  const { isDark } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userIdentity, setUserIdentity] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  console.log(`[APP] AppContent rendered. currentScreen: ${currentScreen}, isDark: ${isDark}`);

  const handleSplashFinish = async () => {
    const token = await authService.getToken();
    if (token) {
      setCurrentScreen('main');
    } else {
      setCurrentScreen('welcome');
    }
  };

  const handleWelcomeLogin = () => {
    setAuthMode('login');
    setCurrentScreen('login');
  };

  const handleWelcomeRegister = () => {
    setAuthMode('register');
    setCurrentScreen('login');
  };

  const handleLoginContinue = (identity: string) => {
    setUserIdentity(identity);
    setCurrentScreen('otp');
  };

  const handleOtpVerify = () => {
    if (authMode === 'register') {
      setCurrentScreen('profile_setup');
    } else {
      setCurrentScreen('main');
    }
  };

  const handleProfileComplete = () => {
    setCurrentScreen('main');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleSkip = () => {
    setCurrentScreen('main');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentScreen('welcome');
  };

  const handleAuthAction = (action: 'login' | 'register') => {
    setAuthMode(action);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    console.log(`[APP] Rendering screen: ${currentScreen}`);
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'welcome':
        return (
          <WelcomeScreen
            onLogin={handleWelcomeLogin}
            onRegister={handleWelcomeRegister}
            onSkip={handleSkip}
          />
        );
      case 'login':
        return (
          <LoginScreen
            mode={authMode}
            onContinue={handleLoginContinue}
            onBack={handleBackToWelcome}
          />
        );
      case 'otp':
        return (
          <OtpScreen
            identity={userIdentity}
            mode={authMode}
            onVerify={handleOtpVerify}
            onBack={handleBackToLogin}
          />
        );
      case 'profile_setup':
        return <ProfileSetupScreen onComplete={handleProfileComplete} />;
      case 'main':
        return (
          <MainContainer
            onLogout={handleLogout}
            onAuthAction={handleAuthAction}
          />
        );
      default:
        return <SplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      {renderScreen()}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
