import apiClient from '../api/client';
import { API_BASE_URL } from '../config';

class AIService {
  constructor() {
    this.selectedModel = localStorage.getItem('selected_model') || 'built-in';
    this.availableModels = [];
  }

  // Fetch available models from backend
  async fetchAvailableModels() {
    try {
      // Use direct fetch to bypass auth interceptors
      const response = await fetch(`${API_BASE_URL}/chatbot/models`);
      
      if (response.ok) {
        const data = await response.json();
        this.availableModels = data.models;
        return this.availableModels;
      } else {
        throw new Error('Failed to fetch models');
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
      // Return a default model if fetching fails
      return [{ id: 'built-in', name: 'Built-in AI', description: 'Default AI' }];
    }
  }

  setModel(modelId) {
    this.selectedModel = modelId;
    localStorage.setItem('selected_model', modelId);
  }

  getModel() {
    return this.selectedModel;
  }

  getAvailableModels() {
    return this.availableModels;
  }

  // Backend AI API call (our own server)
  async callBackend(message, conversationHistory = []) {
    try {
      const response = await apiClient.post(
        '/chatbot/chat',
        {
          message,
          conversationHistory,
          model: this.selectedModel
        }
      );
      return response.response;
    } catch (error) {
      // The apiClient interceptor handles token refresh and standard errors.
      // We just need to pass on the final error message.
      if (error.status === 401) {
        return 'Your session has expired. Please login again.';
      }
      throw new Error(error.message || 'Failed to get AI response');
    }
  }

  // Main method to get AI response
  async getResponse(message, conversationHistory = []) {
    return await this.callBackend(message, conversationHistory);
  }
}

export default new AIService();
