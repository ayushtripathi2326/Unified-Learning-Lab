# Chatbot API Integration Guide

This chatbot supports multiple AI providers with API key configuration.

## Supported AI Providers

### 1. OpenAI (GPT-3.5/GPT-4)

-   **Model**: GPT-3.5-turbo
-   **Get API Key**: https://platform.openai.com/api-keys
-   **Cost**: Pay-per-use (see OpenAI pricing)
-   **Best for**: High-quality conversational responses

### 2. Google Gemini

-   **Model**: Gemini Pro
-   **Get API Key**: https://makersuite.google.com/app/apikey
-   **Cost**: Free tier available
-   **Best for**: Multi-modal capabilities

### 3. Anthropic (Claude)

-   **Model**: Claude 3 Haiku
-   **Get API Key**: https://console.anthropic.com/settings/keys
-   **Cost**: Pay-per-use
-   **Best for**: Long context understanding

### 4. HuggingFace

-   **Model**: Llama-2-7b-chat
-   **Get API Key**: https://huggingface.co/settings/tokens
-   **Cost**: Free tier available
-   **Best for**: Open-source alternative

## Setup Instructions

1. **Access Settings**

    - Click the "⚙️ Settings" button on the chatbot page

2. **Select Provider**

    - Choose your preferred AI provider from the dropdown

3. **Add API Key**

    - Enter your API key in the input field
    - Your API key is stored locally in browser storage
    - It's never sent to our servers

4. **Save Configuration**
    - Click "Save Settings"
    - The chatbot will now use AI-powered responses

## Features

-   **Fallback Mode**: Without an API key, the chatbot uses keyword-based responses
-   **Provider Switching**: Easily switch between different AI providers
-   **Secure Storage**: API keys are stored in browser's localStorage
-   **Error Handling**: Clear error messages for API issues
-   **Rate Limiting**: Handles API rate limits gracefully

## Usage Tips

1. **OpenAI**: Best overall quality, requires payment
2. **Gemini**: Good free option with generous limits
3. **Claude**: Excellent for detailed explanations
4. **HuggingFace**: Completely free but slower responses

## Privacy & Security

-   API keys are stored locally in your browser
-   Keys are never transmitted to our backend
-   Direct communication with AI provider APIs
-   Clear your browser data to remove stored keys

## Troubleshooting

### "Invalid API key" error

-   Verify your API key is correct
-   Check if your API key has necessary permissions
-   Ensure billing is set up (for paid providers)

### "Rate limit exceeded" error

-   Wait a few minutes before trying again
-   Consider upgrading your API plan
-   Switch to a different provider

### No response

-   Check your internet connection
-   Verify the API provider's status page
-   Try clearing and re-entering your API key

## Development

### Adding a New Provider

1. Update `aiService.js` with new provider endpoint
2. Add provider call method (e.g., `callNewProvider`)
3. Update `AI_PROVIDERS` constant
4. Add provider to Settings dropdown

### Environment Variables (Optional)

For development, you can set default API keys:

```bash
REACT_APP_OPENAI_KEY=your_key_here
REACT_APP_GEMINI_KEY=your_key_here
```

## Cost Considerations

| Provider    | Free Tier        | Pricing Model        |
| ----------- | ---------------- | -------------------- |
| OpenAI      | No               | $0.002/1K tokens     |
| Gemini      | Yes (60 req/min) | Free tier available  |
| Anthropic   | No               | $0.25/$1.25 per MTok |
| HuggingFace | Yes              | Free                 |

---

**Note**: Always review the terms of service and pricing for each AI provider before use.
