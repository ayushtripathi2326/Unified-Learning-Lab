import React, { useState, useEffect } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from '../chatbot/config';
import MessageParser from '../chatbot/MessageParser';
import ActionProvider from '../chatbot/ActionProvider';
import Settings from '../components/Settings';
import aiService from '../services/aiService';
import './Chatbot.css';

function ChatbotPage() {
  const [showSettings, setShowSettings] = useState(false);
  const hasApiKey = aiService.hasApiKey();

  useEffect(() => {
    const handleOpenSettings = () => setShowSettings(true);
    window.addEventListener('openSettings', handleOpenSettings);
    return () => window.removeEventListener('openSettings', handleOpenSettings);
  }, []);

  return (
    <div className="chatbot-page">
      <div className="chatbot-header">
        <div>
          <h1>Learning Assistant Chatbot</h1>
          <p>
            {hasApiKey ? (
              <>✅ AI-powered responses enabled ({aiService.getProvider()})</>
            ) : (
              <>⚠️ Using basic keyword responses. Configure API key for intelligent responses.</>
            )}
          </p>
        </div>
        <button
          className="settings-btn"
          onClick={() => setShowSettings(true)}
          title="Configure AI Settings"
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="chatbot-container">
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default ChatbotPage;
