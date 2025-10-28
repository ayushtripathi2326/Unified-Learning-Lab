import apiClient from './client';

export const authService = {
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.token) {
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
        }
        return response;
    },

    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        if (response.token) {
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
        }
        return response;
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/auth/refresh', { refreshToken });
        if (response.token) {
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
        }
        return response;
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
    },

    getCurrentUser: async () => {
        return apiClient.get('/auth/me');
    },

    updateDetails: async (userData) => {
        return apiClient.put('/auth/updatedetails', userData);
    },

    updatePassword: async (passwordData) => {
        return apiClient.put('/auth/updatepassword', passwordData);
    },

    forgotPassword: async (email) => {
        return apiClient.post('/auth/forgotpassword', { email });
    },

    resetPassword: async (token, password) => {
        return apiClient.put(`/auth/resetpassword/${token}`, { password });
    },

    verifyEmail: async (token) => {
        return apiClient.get(`/auth/verifyemail/${token}`);
    },
};

export const questionService = {
    getAll: async (params) => {
        return apiClient.get('/questions', { params });
    },

    getById: async (id) => {
        return apiClient.get(`/questions/${id}`);
    },

    getByTopic: async (topic) => {
        return apiClient.get('/questions', { params: { topic } });
    },
};

export const resultService = {
    submit: async (resultData) => {
        return apiClient.post('/results', resultData);
    },

    getUserResults: async () => {
        return apiClient.get('/results/user');
    },

    getById: async (id) => {
        return apiClient.get(`/results/${id}`);
    },
};
