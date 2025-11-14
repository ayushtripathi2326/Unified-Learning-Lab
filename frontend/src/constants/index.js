// API Configuration
import { API_BASE_URL as CONFIG_API_URL } from '../config';
export const API_BASE_URL = CONFIG_API_URL;

// App Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    APTITUDE_TEST: '/aptitude-test',
    BINARY_SEARCH: '/binary-search',
    BINARY_TREE: '/binary-tree',
    STACK_QUEUE: '/stack-queue',
    CNN_VISUALIZER: '/cnn-visualizer',
};

// Topics
export const TOPICS = {
    DATA_STRUCTURES: 'data-structures',
    ALGORITHMS: 'algorithms',
    MACHINE_LEARNING: 'machine-learning',
    NEURAL_NETWORKS: 'neural-networks',
};

// Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
};
