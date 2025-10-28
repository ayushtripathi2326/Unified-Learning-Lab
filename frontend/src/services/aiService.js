import axios from 'axios';

// Configuration for different AI providers
const AI_PROVIDERS = {
  OPENAI: 'openai',
  GEMINI: 'gemini',
  ANTHROPIC: 'anthropic',
  HUGGINGFACE: 'huggingface',
};

// API endpoints
const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  anthropic: 'https://api.anthropic.com/v1/messages',
  huggingface: 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
};

class AIService {
  constructor() {
    this.provider = localStorage.getItem('ai_provider') || AI_PROVIDERS.OPENAI;
    this.apiKey = localStorage.getItem('ai_api_key') || '';
  }

  setProvider(provider) {
    this.provider = provider;
    localStorage.setItem('ai_provider', provider);
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
    localStorage.setItem('ai_api_key', apiKey);
  }

  getProvider() {
    return this.provider;
  }

  getApiKey() {
    return this.apiKey;
  }

  hasApiKey() {
    return !!this.apiKey;
  }

  // OpenAI API call
  async callOpenAI(message, conversationHistory = []) {
    try {
      const response = await axios.post(
        API_ENDPOINTS.openai,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful learning assistant specializing in data structures, algorithms, and programming concepts. Provide clear, educational responses.',
            },
            ...conversationHistory,
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      throw this.handleError(error, 'OpenAI');
    }
  }

  // Google Gemini API call
  async callGemini(message, conversationHistory = []) {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.gemini}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful learning assistant specializing in data structures, algorithms, and programming concepts. User question: ${message}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw this.handleError(error, 'Gemini');
    }
  }

  // Anthropic Claude API call
  async callAnthropic(message, conversationHistory = []) {
    try {
      const response = await axios.post(
        API_ENDPOINTS.anthropic,
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          messages: [
            ...conversationHistory,
            { role: 'user', content: message },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      throw this.handleError(error, 'Anthropic');
    }
  }

  // HuggingFace API call
  async callHuggingFace(message) {
    try {
      const response = await axios.post(
        API_ENDPOINTS.huggingface,
        {
          inputs: message,
          parameters: {
            max_length: 500,
            temperature: 0.7,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data[0].generated_text;
    } catch (error) {
      throw this.handleError(error, 'HuggingFace');
    }
  }

  // Main method to get AI response
  async getResponse(message, conversationHistory = []) {
    if (!this.hasApiKey()) {
      throw new Error('No API key configured. Please set an API key in settings.');
    }

    switch (this.provider) {
      case AI_PROVIDERS.OPENAI:
        return await this.callOpenAI(message, conversationHistory);
      case AI_PROVIDERS.GEMINI:
        return await this.callGemini(message, conversationHistory);
      case AI_PROVIDERS.ANTHROPIC:
        return await this.callAnthropic(message, conversationHistory);
      case AI_PROVIDERS.HUGGINGFACE:
        return await this.callHuggingFace(message);
      default:
        throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  handleError(error, providerName) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        return new Error(`Invalid API key for ${providerName}. Please check your API key.`);
      } else if (status === 429) {
        return new Error(`Rate limit exceeded for ${providerName}. Please try again later.`);
      } else if (status === 500) {
        return new Error(`${providerName} server error. Please try again.`);
      }
      return new Error(`${providerName} API error: ${error.response.data?.error?.message || error.message}`);
    }
    return new Error(`Network error: ${error.message}`);
  }
}

export default new AIService();
export { AI_PROVIDERS };
