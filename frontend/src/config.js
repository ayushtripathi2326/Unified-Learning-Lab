// API Configuration
export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 
                            'http://localhost:5001/api';

export const config = {
    apiUrl: API_BASE_URL,
    timeout: 10000,
};

console.log('🔧 API Configuration:', API_BASE_URL);
