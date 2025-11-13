// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
                            process.env.REACT_APP_API_URL || 
                            'https://unified-learning-lab.onrender.com/api';

export const config = {
    apiUrl: API_BASE_URL,
    timeout: 10000,
};

console.log('🔧 API Configuration:', API_BASE_URL);
