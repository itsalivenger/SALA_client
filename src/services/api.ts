

/**
 * API Configuration
 * 
 * For local development:
 * - Android Emulator: 10.0.2.2
 * - iOS Simulator: localhost
 * - Physical Device: Your computer's local IP (e.g., 192.168.1.XX)
 */

// --- CONFIGURATION ---
// Replace '127.0.0.1' with your computer's local IP if testing on a physical device.
const LOCAL_IP = '192.168.11.113';

const getBaseUrl = () => {
    if (__DEV__) {
        // Use LOCAL_IP for both iOS and Android physical devices/simulators
        // (10.0.2.2 is only for Android Emulator, but LOCAL_IP works for both if set correctly)
        return `http://${LOCAL_IP}:5000/api`;
    }
    return 'https://api.sala.pro/api'; // Production URL placeholder
};

const BASE_URL = getBaseUrl();

export const request = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        signal: controller.signal
    };

    try {
        console.log(`[API] Fetching: ${url}`, config.method || 'GET', options.body || '');
        const response = await fetch(url, config);
        clearTimeout(id);

        const data = await response.json();
        console.log(`[API] Response from ${endpoint}:`, data);

        if (!response.ok) {
            throw {
                message: data.message || 'Something went wrong',
                status: response.status,
                data: data
            };
        }

        return data;
    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            console.error(`API Request Timeout [${endpoint}]`);
            throw { message: 'Le serveur met trop de temps à répondre (Timeout)' };
        }
        console.error(`API Request Error [${endpoint}]:`, error);
        throw error;
    }
};

export default {
    get: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, body: any, options?: RequestInit) =>
        request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint: string, body: any, options?: RequestInit) =>
        request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'DELETE' }),
};
