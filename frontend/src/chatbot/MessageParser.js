import aiService from '../services/aiService';

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (aiService.hasApiKey()) {
      // Use AI service for intelligent responses
      this.actionProvider.handleAIResponse(message);
    } else {
      // Fall back to keyword matching
      if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
        this.actionProvider.handleHello();
      } else if (lowerCaseMessage.includes("data structure")) {
        this.actionProvider.handleDataStructures();
      } else if (lowerCaseMessage.includes("algorithm")) {
        this.actionProvider.handleAlgorithms();
      } else if (lowerCaseMessage.includes("binary tree")) {
        this.actionProvider.handleBinaryTree();
      } else if (lowerCaseMessage.includes("stack")) {
        this.actionProvider.handleStack();
      } else if (lowerCaseMessage.includes("queue")) {
        this.actionProvider.handleQueue();
      } else if (lowerCaseMessage.includes("linked list")) {
        this.actionProvider.handleLinkedList();
      } else if (lowerCaseMessage.includes("hash table")) {
        this.actionProvider.handleHashTable();
      } else if (lowerCaseMessage.includes("sorting")) {
        this.actionProvider.handleSorting();
      } else if (lowerCaseMessage.includes("searching")) {
        this.actionProvider.handleSearching();
      } else {
        this.actionProvider.handleDefault();
      }
    }
  }
}

export default MessageParser;
