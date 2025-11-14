// API Configuration
const isDevelopment = window.location.hostname === 'localhost';
export const API_BASE_URL = (typeof import.meta !== 'undefined' && 
                            (import.meta.env?.VITE_BACKEND_URL || import.meta.env?.VITE_API_BASE_URL)) || 
                            (isDevelopment ? 'http://localhost:5002/api' : 'https://unified-learning-lab-backend.onrender.com/api');

export const config = {
    apiUrl: API_BASE_URL,
    timeout: 10000,
};

console.log('🔧 API Configuration:', API_BASE_URL);
