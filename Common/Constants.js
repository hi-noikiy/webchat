export const SupportedWebchatUrls = [
  'goquiq.com/app/webchat',
  'quiq.sh/app/webchat',
  'centricient.com/app/webchat',
  'centricient.corp/app/webchat',
  'quiq.dev:7000/app/webchat',
  'quiq.dev:3000/app/webchat',
  'centricient.dev:7000/app/webchat',
  'quiq.dev:41014/app/webchat',
  'centricient.dev:41014/app/webchat',
];

export const unknownErrorMessage = 'An unknown error occurred.';

// Default launch button classes and id's
export const noAgentsAvailableClass = 'noAgentsAvailable';
export const mobileClass = 'mobile';
export const unsupportedBrowserClass = 'unsupportedBrowser';
export const storageDisabledClass = 'storageDisabled';
export const hasMobileNumberClass = 'hasMobileNumber';

export const chatClosedClass = 'ChatClosed';
export const chatOpenClass = 'ChatOpen';
export const quiqContainerId = 'quiqWebChat';

export const webchatPath = 'app/webchat/webchat.html';
export const bridgePath = 'app/webchat/bridge.html';

export const StandaloneWindowName = 'quiq-standalone-webchat';

export const eventTypes: {[string]: string} = {
  messageArrived: 'QUIQ_MESSAGE_ARRIVED',
  chatVisibilityDidChange: 'QUIQ_CHAT_VISIBILITY_DID_CHANGE',
  _standaloneOpen: 'QUIQ_STANDALONE_OPEN',
  _launchButtonVisibilityShouldChange: 'QUIQ_LAUNCH_BUTTON_VISIBILITY_SHOULD_CHANGE',
  _configurationDidChange: 'QUIQ_CONFIGURATION_DID_CHANGE',
  _chatIsReady: 'QUIQ_CHAT_IS_READY',
};

// Any eventType that does not begin with "_" is exposed on the Quiq object handed to the client.
export const publicEventTypes = Object.keys(eventTypes).reduce(
  (acc, k) => Object.assign({}, acc, k.startsWith('_') ? {} : {[k]: eventTypes[k]}),
  {},
);

export const MessageTypes = {
  TEXT: 'Text',
  ATTACHMENT: 'Attachment',
};

export const EventTypes = {
  JOIN: 'Join',
  LEAVE: 'Leave',
  REGISTER: 'Register',
  AGENT_TYPING: 'AgentTyping',
  AGENT_ENDED_CONVERSATION: 'AgentEndedConversation',
  END: 'End',
  SPAM: 'Spam',
  SEND_TRANSCRIPT: 'SendTranscript',
  ASSIGNED: 'Assigned',
};

export const AuthorTypes = {
  CUSTOMER: 'Customer',
  USER: 'User',
  SYSTEM: 'System',
};

export const AttachmentErrorTypes = {
  TOO_LARGE: 'attachmentTooLarge',
  UNSUPPORTED_TYPE: 'attachmentUnsupportedType',
  UPLOAD_ERROR: 'attachmentUploadError',
};

// Define subsets of events
export const EndEventTypes = [EventTypes.END, EventTypes.SPAM];

export const DisplayElementTypes = [
  MessageTypes.TEXT,
  MessageTypes.ATTACHMENT,
  EventTypes.SEND_TRANSCRIPT,
  EventTypes.END,
  EventTypes.SPAM,
  EventTypes.ASSIGNED,
  AttachmentErrorTypes.TOO_LARGE,
  AttachmentErrorTypes.UNSUPPORTED_TYPE,
  AttachmentErrorTypes.UPLOAD_ERROR,
];

export const reduxActionTypes = {
  uploadProgress: 'UPLOAD_PROGRESS',
  addPendingMessage: 'ADD_PENDING_MESSAGE',
  updatePendingMessageId: 'UPDATE_PENDING_MESSAGE_ID',
  updatePlatformEvents: 'UPDATE_PLATFORM_EVENTS',
  configurationLoaded: 'CHAT_CONFIGURATION_LOADED',
  removeMessage: 'REMOVE_MESSAGE',
  isAgentAssigned: 'AGENT_ASSIGNED',
  addAttachmentError: 'ADD_ATTACHMENT_ERROR',
};

export const postmasterActionTypes = {
  loadChat: 'QUIQ_LOAD_CHAT',
  unloadChat: 'QUIQ_UNLOAD_CHAT',
  getChatStatus: 'QUIQ_GET_CHAT_STATUS',
  setChatVisibility: 'QUIQ_SET_CHAT_VISIBILITY',
  getChatVisibility: 'QUIQ_GET_CHAT_VISIBILITY',
  getAgentAvailability: 'QUIQ_GET_AGENT_AVAILABILITY',
  getHandle: 'QUIQ_GET_HANDLE',
  getCanFlashNotifications: 'QUIQ_GET_CAN_FLASH_NOTIFICATIONS',
  getMobileChatEnabled: 'QUIQ_GET_MOBILE_CHAT',
  getLocalStorage: 'QUIQ_GET_LOCAL_STORAGE',
};

export const ExtensionSdkEventTypes = {
  ESTIMATED_WAIT_TIME_CHANGED: 'estimatedWaitTimeChanged',
};

export const ChatInitializedState = {
  UNINITIALIZED: 'uninitialized',
  LOADING: 'loading',
  INITIALIZED: 'initialized',
  ERROR: 'error',
  DISCONNECTED: 'disconnected',
  INACTIVE: 'inactive',
  BURNED: 'burned',
  SLEEPING: 'sleeping',
};

export const intlMessageTypes = {
  pageTitle: 'pageTitle',
  titleText: 'titleText',
  headerText: 'headerText',
  sendButtonLabel: 'sendButtonLabel',
  messageFieldPlaceholder: 'messageFieldPlaceholder',
  invalidEmailErrorMessage: 'invalidEmailErrorMessage',
  welcomeFormValidationErrorMessage: 'welcomeFormValidationErrorMessage',
  welcomeFormSubmitButtonLabel: 'welcomeFormSubmitButtonLabel',
  welcomeFormSubmittingButtonLabel: 'welcomeFormSubmittingButtonLabel',
  connectingMessage: 'connectingMessage',
  reconnectingMessage: 'reconnectingMessage',
  agentTypingMessage: 'agentTypingMessage',
  agentAssignedMessage: 'agentAssignedMessage',
  agentsNotAvailableMessage: 'agentsNotAvailableMessage',
  agentEndedConversationMessage: 'agentEndedConversationMessage',
  errorMessage: 'errorMessage',
  inactiveMessage: 'inactiveMessage',
  requiredFieldAriaLabel: 'requiredFieldAriaLabel',
  dockWindowTooltip: 'dockWindowTooltip',
  openInNewWindowTooltip: 'openInNewWindowTooltip',
  optionsMenuTooltip: 'optionsMenuTooltip',
  emailTranscriptMenuMessage: 'emailTranscriptMenuMessage',
  emailTranscriptMenuTooltip: 'emailTranscriptMenuTooltip',
  emailTranscriptInputPlaceholder: 'emailTranscriptInputPlaceholder',
  emailTranscriptInputCancelTooltip: 'emailTranscriptInputCancelTooltip',
  emailTranscriptInputSubmitTooltip: 'emailTranscriptInputSubmitTooltip',
  emailTranscriptInlineButton: 'emailTranscriptInlineButton',
  messageArrivedNotification: 'messageArrivedNotification',
  closeWindowTooltip: 'closeWindowTooltip',
  emojiPickerTooltip: 'emojiPickerTooltip',
  attachmentBtnTooltip: 'attachmentBtnTooltip',
  unsupportedFileType: 'unsupportedFileType',
  attachmentTooLarge: 'attachmentTooLarge',
  attachmentUploadError: 'attachmentUploadError',
  muteSounds: 'muteSounds',
  unmuteSounds: 'unmuteSounds',
  muteSoundsTooltip: 'muteSoundsTooltip',
  unmuteSoundsTooltip: 'unmuteSoundsTooltip',
  transcriptEmailedEventMessage: 'transcriptEmailedEventMessage',
  cannotStartNewConversationMessage: 'cannotStartNewConversationMessage',
  unsupportedOrientation: 'unsupportedOrientation',
};

export const localStorageKeys = ['quiq-data'];

export const MenuItemKeys = {
  EMAIL_TRANSCRIPT: 'emailTranscript',
  MUTE_SOUNDS: 'muteSounds',
};

export const UserEmailKey = 'quiq-client-data';

export const maxAttachmentSize = 25 * 1000000;

export const displayModes = {
  DOCKED: 'docked',
  UNDOCKED: 'undocked',
  EITHER: 'either',
};
