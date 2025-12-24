import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@sala_auth_token';
const USER_KEY = '@sala_user_info';

export const authService = {
    /**
     * Request OTP for Login
     */
    login: async (phoneNumber: string) => {
        return api.post('/client/auth/login', { phoneNumber });
    },

    /**
     * Request OTP for Registration
     */
    register: async (phoneNumber: string) => {
        return api.post('/client/auth/register', { phoneNumber });
    },

    /**
     * Verify OTP and receive token
     */
    verifyOtp: async (phoneNumber: string, code: string) => {
        const response = await api.post('/client/auth/verify', { phoneNumber, code });

        if (response.success && response.token) {
            await AsyncStorage.setItem(TOKEN_KEY, response.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Update user profile (Protected)
     */
    updateProfile: async (name: string, city: string) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return api.put('/client/auth/profile', { name, city }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    /**
     * Logout
     */
    logout: async () => {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
    },

    /**
     * Get stored user
     */
    getUser: async () => {
        const user = await AsyncStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Get stored token
     */
    getToken: async () => {
        return AsyncStorage.getItem(TOKEN_KEY);
    },

    /**
     * Remember Me Helpers
     */
    saveRememberedIdentity: async (identity: string) => {
        await AsyncStorage.setItem('@sala_remembered_identity', identity);
    },

    getRememberedIdentity: async () => {
        return AsyncStorage.getItem('@sala_remembered_identity');
    },

    clearRememberedIdentity: async () => {
        await AsyncStorage.removeItem('@sala_remembered_identity');
    }
};

export default authService;
