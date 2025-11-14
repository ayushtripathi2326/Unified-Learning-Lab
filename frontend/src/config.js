// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                            'https://unified-learning-lab.onrender.com/api';

export const config = {
    apiUrl: API_BASE_URL,
    timeout: 10000,
};

console.log('🔧 API Configuration:', API_BASE_URL);
