export const registerChatClient = jest.fn();
export const getChatClient = jest.fn().mockReturnValue({
  onNewMessages: jest.fn(),
  onAgentTyping: jest.fn(),
  onError: jest.fn(),
  onErrorResolved: jest.fn(),
  onConnectionStatusChange: jest.fn(),
  onBurn: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  getMessages: jest.fn(),
  joinChat: jest.fn(),
  leaveChat: jest.fn(),
  sendMessage: jest.fn(),
  updateMessagePreview: jest.fn(),
  sendRegistration: jest.fn(),
  checkForAgents: jest.fn(),
  hasActiveChat: jest.fn(),
  getLastUserEvent: jest.fn(),
});
