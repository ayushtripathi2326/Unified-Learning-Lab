import { API_BASE_URL } from '../config';

// Wake up sleeping backend
export const wakeUpBackend = async () => {
  try {
    console.log('🔄 Waking up backend...');
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
      timeout: 30000
    });
    
    if (response.ok) {
      console.log('✅ Backend is awake');
      return true;
    }
  } catch (error) {
    console.log('⏳ Backend still waking up...');
  }
  return false;
};

// Auto wake-up on app load
export const initBackendWakeup = () => {
  wakeUpBackend();
};