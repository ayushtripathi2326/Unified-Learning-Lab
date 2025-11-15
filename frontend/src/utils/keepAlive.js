import { API_BASE_URL } from '../config';

// Keep backend alive to prevent sleeping (free tier optimization)
let keepAliveInterval;

export const startKeepAlive = () => {
  // Ping every 14 minutes to prevent 15-minute sleep
  keepAliveInterval = setInterval(async () => {
    try {
      await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
        method: 'GET',
        cache: 'no-cache'
      });
      console.log('🔄 Backend keep-alive ping sent');
    } catch (error) {
      console.log('⚠️ Keep-alive ping failed');
    }
  }, 14 * 60 * 1000); // 14 minutes
};

export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
};