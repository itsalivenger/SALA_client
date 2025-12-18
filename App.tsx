import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import OtpScreen from './src/screens/auth/OtpScreen';
import MainContainer from './src/screens/MainContainer';

type Screen = 'splash' | 'welcome' | 'login' | 'otp' | 'main';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userIdentity, setUserIdentity] = useState('');

  const handleSplashFinish = () => {
    setCurrentScreen('welcome');
  };

  const handleWelcomeLogin = () => {
    setCurrentScreen('login');
  };

  const handleLoginContinue = (identity: string) => {
    setUserIdentity(identity);
    setCurrentScreen('otp');
  };

  const handleOtpVerify = (code: string) => {
    // In a real app, verify the code here
    console.log('Verifying code:', code);
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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'welcome':
        return (
          <WelcomeScreen
            onLogin={handleWelcomeLogin}
            onRegister={handleWelcomeLogin}
            onSkip={handleSkip}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onContinue={handleLoginContinue}
            onBack={handleBackToWelcome}
          />
        );
      case 'otp':
        return (
          <OtpScreen
            identity={userIdentity}
            onVerify={handleOtpVerify}
            onBack={handleBackToLogin}
          />
        );
      case 'main':
        return <MainContainer />;
      default:
        return <SplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return (
    <SafeAreaProvider>
      {renderScreen()}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

