import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

class ApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Allow cookies
        });

        this.isRefreshing = false;
        this.failedQueue = [];

        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response.data,
            async (error) => {
                const originalRequest = error.config;

                // Handle token expiration
                if (error.response?.status === 401 &&
                    error.response?.data?.code === 'TOKEN_EXPIRED' &&
                    !originalRequest._retry) {

                    if (this.isRefreshing) {
                        // Queue the request while token is being refreshed
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                        .then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return this.client(originalRequest);
                        })
                        .catch(err => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (!refreshToken) {
                            throw new Error('No refresh token');
                        }

                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                            refreshToken
                        });

                        const { token, refreshToken: newRefreshToken } = response.data;

                        localStorage.setItem('token', token);
                        if (newRefreshToken) {
                            localStorage.setItem('refreshToken', newRefreshToken);
                        }

                        // Retry all queued requests
                        this.failedQueue.forEach(({ resolve }) => resolve(token));
                        this.failedQueue = [];

                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        // Refresh failed, logout user
                        this.failedQueue.forEach(({ reject }) => reject(refreshError));
                        this.failedQueue = [];

                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';

                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                // Handle other 401 errors (invalid token, etc.)
                if (error.response?.status === 401 && !originalRequest._retry) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }

                // Handle account locked
                if (error.response?.status === 423) {
                    return Promise.reject({
                        message: error.response.data.message || 'Account is locked',
                        status: 423
                    });
                }

                // Handle validation errors
                if (error.response?.status === 400 && error.response?.data?.errors) {
                    return Promise.reject({
                        message: 'Validation failed',
                        errors: error.response.data.errors,
                        status: 400
                    });
                }

                return Promise.reject(error.response?.data || error.message);
            }
        );
    }

    get(url, config) {
        return this.client.get(url, config);
    }

    post(url, data, config) {
        return this.client.post(url, data, config);
    }

    put(url, data, config) {
        return this.client.put(url, data, config);
    }

    delete(url, config) {
        return this.client.delete(url, config);
    }

    patch(url, data, config) {
        return this.client.patch(url, data, config);
    }
}

export default new ApiClient();
