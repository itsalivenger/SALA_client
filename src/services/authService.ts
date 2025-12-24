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
        const response = await api.put('/client/auth/profile', { name, city }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.success && response.user) {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Support Reclamations
     */
    createReclamation: async (category: string, subject: string, message: string, orderId?: string) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return api.post('/client/support/reclamations', { category, subject, message, orderId }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    getReclamations: async () => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return api.get('/client/support/reclamations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    sendReclamationMessage: async (reclamationId: string, text: string) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return api.post(`/client/support/reclamations/${reclamationId}/messages`, { text }, {
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
    },

    /**
     * Phone Number Change
     */
    requestPhoneChange: async (newPhoneNumber: string) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return api.post('/client/auth/phone-change/request', { newPhoneNumber }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    verifyPhoneChange: async (newPhoneNumber: string, code: string) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const response = await api.post('/client/auth/phone-change/verify', { newPhoneNumber, code }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Update token and user if successful
        if (response.success && response.token) {
            await AsyncStorage.setItem(TOKEN_KEY, response.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }

        return response;
    }
};

export default authService;
