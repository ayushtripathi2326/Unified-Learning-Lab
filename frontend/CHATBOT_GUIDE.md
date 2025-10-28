# Chatbot Feature - Quick Start Guide

## Overview

The Learning Lab chatbot now supports **multiple AI providers** with API key configuration! You can choose from OpenAI, Google Gemini, Anthropic Claude, or HuggingFace models.

## 🚀 Features

### 1. **Dual Mode Operation**

-   **With API Key**: AI-powered intelligent responses using your chosen provider
-   **Without API Key**: Keyword-based fallback responses for common topics

### 2. **Multiple AI Providers**

-   OpenAI (GPT-3.5/4) - Premium quality
-   Google Gemini - Free tier available
-   Anthropic Claude - Long context understanding
-   HuggingFace - Open source models

### 3. **Easy Configuration**

-   Visual settings interface
-   Provider selection dropdown
-   Secure local storage
-   One-click setup

## 📖 How to Use

### Step 1: Access the Chatbot

Navigate to `/chatbot` or click **AI Assistant** in the sidebar.

### Step 2: Configure API (Optional but Recommended)

1. Click the **⚙️ Settings** button
2. Select your preferred AI provider
3. Enter your API key
4. Click **Save Settings**

### Step 3: Start Chatting

Ask questions about:

-   Data structures (arrays, trees, graphs, etc.)
-   Algorithms (sorting, searching, etc.)
-   Programming concepts
-   Computer science topics

## 🔑 Getting API Keys

### OpenAI

1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy and paste into chatbot settings

### Google Gemini (Recommended for Free Users)

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API key"
4. Free tier: 60 requests per minute

### Anthropic Claude

1. Visit https://console.anthropic.com/settings/keys
2. Create account
3. Generate API key
4. Requires billing setup

### HuggingFace

1. Visit https://huggingface.co/settings/tokens
2. Create account
3. Generate access token
4. Completely free!

## 💡 Usage Examples

### Without API Key (Keyword Mode)

**User**: "Tell me about stacks"
**Bot**: "A stack is a linear data structure that follows the Last In First Out (LIFO) principle..."

### With API Key (AI Mode)

**User**: "Explain the difference between DFS and BFS"
**Bot**: "Depth-First Search (DFS) and Breadth-First Search (BFS) are both graph traversal algorithms, but they differ in how they explore nodes..."

## 🛡️ Security & Privacy

-   ✅ API keys stored **locally** in your browser
-   ✅ Never sent to our backend servers
-   ✅ Direct communication with AI providers
-   ✅ Clear browser data to remove keys
-   ✅ Toggle visibility for safe entry

## 🐛 Troubleshooting

### "Invalid API key" Error

-   Double-check your API key is correct
-   Ensure you've set up billing (for paid providers)
-   Try regenerating the API key

### "Rate limit exceeded"

-   Wait a few minutes
-   Check your provider's quota
-   Consider upgrading your plan

### Chatbot not responding

-   Check internet connection
-   Verify API key is saved
-   Try refreshing the page

## 💰 Cost Comparison

| Provider    | Free Tier | Cost (if paid)     | Best For           |
| ----------- | --------- | ------------------ | ------------------ |
| OpenAI      | No        | ~$0.002/1K tokens  | Quality            |
| Gemini      | ✅ Yes    | Free tier generous | Best free option   |
| Claude      | No        | ~$0.25-$1.25/MTok  | Long conversations |
| HuggingFace | ✅ Yes    | Free               | Open source        |

## 🎯 Best Practices

1. **Start with Gemini** - Great free option to test the feature
2. **Protect Your Keys** - Don't share screenshots with visible keys
3. **Monitor Usage** - Check your provider dashboard regularly
4. **Use Fallback Mode** - Works without API key for basic queries
5. **Switch Providers** - Try different ones for various use cases

## 📱 Responsive Design

The chatbot works on:

-   Desktop computers
-   Tablets
-   Mobile phones

## 🔄 Updates & Improvements

Future enhancements planned:

-   [ ] Conversation history
-   [ ] Export chat transcripts
-   [ ] Custom system prompts
-   [ ] More AI providers
-   [ ] Voice input/output

---

**Need Help?** Check the [CHATBOT_SETUP.md](./CHATBOT_SETUP.md) for detailed technical documentation.
