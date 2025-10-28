import { createChatBotMessage } from 'react-chatbot-kit';
import SettingsPrompt from './widgets/SettingsPrompt';

const config = {
  botName: "LearningBot",
  initialMessages: [
    createChatBotMessage("Hi! I'm your learning assistant. How can I help you today?"),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#376B7E",
    },
  },
  widgets: [
    {
      widgetName: 'settingsPrompt',
      widgetFunc: (props) => <SettingsPrompt {...props} />,
    },
  ],
};

export default config;
