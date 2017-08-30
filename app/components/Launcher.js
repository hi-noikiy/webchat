// @flow
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {registerIntlObject} from 'Common/i18n';
import quiqOptions, {openStandaloneMode} from 'utils/quiq';
import ChatContainer from './ChatContainer';
import './styles/Launcher.scss';
import QuiqChatClient from 'quiq-chat';
import * as chatActions from 'actions/chatActions';
import {standaloneOpen} from 'services/MalfunctionJunction';
import messages from 'messages';
import {displayError, isMobile, inStandaloneMode} from 'Common/Utils';
import {noAgentsAvailableClass, mobileClass, ChatInitializedState} from 'Common/Constants';
import {connect} from 'react-redux';
import {compose} from 'redux';
import type {IntlObject, ChatState, Message, ChatInitializedStateType} from 'types';

type LauncherState = {
  agentsAvailable?: boolean, // Undefined means we're still looking it up
};

export type LauncherProps = {
  intl: IntlObject,
  chatContainerHidden: boolean,
  initializedState: ChatInitializedStateType,
  transcript: Array<Message>,
  welcomeFormRegistered: boolean,

  setChatContainerHidden: (chatContainerHidden: boolean) => void,
  setAgentsAvailable: (agentsAvailable: boolean) => void,
  setChatInitialized: (initialized: ChatInitializedStateType) => void,
  setWelcomeFormRegistered: () => void,
  setAgentTyping: (typing: boolean) => void,
  updateTranscript: (transcript: Array<Message>) => void,
  newWebchatSession: () => void,
};

export class Launcher extends Component<LauncherProps, LauncherState> {
  props: LauncherProps;
  state: LauncherState = {};
  updateAgentAvailabilityInterval: number;
  updateCustomChatButtonsInterval: number;
  typingTimeout: ?number;
  autoPopTimeout: ?number;

  componentDidMount() {
    registerIntlObject(this.props.intl);
    this.registerClientCallbacks();
    this.updateAgentAvailabilityInterval = setInterval(this.updateAgentAvailability, 1000 * 60);

    /*if (!this.props.chatLauncherHidden) {
      clearTimeout(this.autoPopTimeout);
    }*/

    this.init();
  }

  componentWillReceiveProps(nextProps: LauncherProps) {
    if (this.props.chatContainerHidden && !nextProps.chatContainerHidden) {
      clearTimeout(this.autoPopTimeout);
    }
    // Respond to change in chat visibility
    if (nextProps.chatContainerHidden !== this.props.chatContainerHidden)
      this.handleChatVisibilityChange(nextProps.chatContainerHidden);
  }

  componentWillUnmount() {
    clearInterval(this.updateAgentAvailabilityInterval);
    clearInterval(this.updateCustomChatButtonsInterval);
    clearTimeout(this.typingTimeout);
    clearTimeout(this.autoPopTimeout);
    getChatClient().stop();
  }

  updateAgentAvailability = async () => {
    const {available} = await this.client.checkForAgents();
    this.props.setAgentsAvailable(available);
  };

  updateContainerHidden = (hidden: boolean) => {
    if (hidden !== this.props.chatContainerHidden) {
      this.props.setChatContainerHidden(hidden);
    }
  };

  updateInitializedState = (newState: ChatInitializedStateType) => {
    if (newState !== this.props.initializedState) {
      this.props.setChatInitialized(newState);
    }
  };

  handleNewSession = () => {
    this.props.newWebchatSession();
  };

  registerClientCallbacks = () => {
    QuiqChatClient.onNewMessages(this.props.updateTranscript);
    QuiqChatClient.onRegistration(this.props.setWelcomeFormRegistered);
    QuiqChatClient.onAgentTyping(this.handleAgentTyping);
    QuiqChatClient.onConnectionStatusChange((connected: boolean) =>
      this.updateInitializedState(
        connected ? ChatInitializedState.INITIALIZED : ChatInitializedState.DISCONNECTED,
      ),
    );
    QuiqChatClient.onError(() => this.updateInitializedState(ChatInitializedState.ERROR));
    QuiqChatClient.onErrorResolved(() =>
      this.updateInitializedState(ChatInitializedState.INITIALIZED),
    );
    QuiqChatClient.onBurn(() => this.updateInitializedState(ChatInitializedState.BURNED));
    QuiqChatClient.onNewSession(this.handleNewSession);
    QuiqChatClient.onClientInactiveTimeout(this.handleClientInactiveTimeout);
  };

  init = async () => {
    this.updateAgentAvailability();
    // Standalone Mode
    // Never show launcher
    // Always start session, show ChatContainer
    if (inStandaloneMode()) {
      this.updateContainerHidden(false);
      await this.startSession();
      return;
    }

    // ChatContainer Visible from cookie
    // Always start session, always show launcher
    if (this.client.isChatVisible()) {
      this.updateContainerHidden(false);
      await this.startSession();
      return;
    }

    // User has submitted welcome form or sent message, ChatContainer not visible
    // Show launcher if transcript length > 0
    // Always start session, don't change ChatContainer
    if (QuiqChatClient.hasTakenMeaningfulAction()) {
      await this.startSession();
      return;
    }

    this.handleAutoPop();
  };

  startSession = async () => {
    if (
      this.props.initializedState === ChatInitializedState.LOADING ||
      this.props.initializedState === ChatInitializedState.INITIALIZED
    )
      return;

    try {
      this.updateInitializedState(ChatInitializedState.LOADING);
      await QuiqChatClient.start();
      this.updateInitializedState(ChatInitializedState.INITIALIZED);

      // User has session in progress. Send them right to it.
      if (this.props.transcript.length > 0) {
        this.props.setWelcomeFormRegistered();
      }
    } catch (e) {
      this.updateInitializedState(ChatInitializedState.ERROR);
    }
  };

  handleAgentTyping = (typing: boolean) => {
    this.props.setAgentTyping(typing);

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (!typing) return;

    this.typingTimeout = setTimeout(() => {
      this.props.setAgentTyping(false);
    }, 10000);
  };

  handleAutoPop = () => {
    if (!isMobile() && typeof quiqOptions.autoPopTime === 'number') {
      this.autoPopTimeout = setTimeout(() => {
        this.startSession();
        this.updateContainerHidden(false);
      }, quiqOptions.autoPopTime);
    }
  };

  handleClientInactiveTimeout = () => {
    this.updateInitializedState(ChatInitializedState.INACTIVE);
    if (!this.props.chatContainerHidden && !this.props.popped) {
      this.updateContainerHidden(true);
    }
  };

  openNativeSMSApp = () => {
    if (quiqOptions.mobileNumber) {
      window.location = `sms:${quiqOptions.mobileNumber}`;
    }
  };

  handleChatVisibilityChange = async (hidden: boolean) => {
    if (!hidden) {
      //await this.startSession();
      this.client.joinChat();
    } else {
      this.client.leaveChat();
    }
  };

  toggleChat = async () => {
    if (this.props.chatContainerHidden) {
      this.updateContainerHidden(false);
      await this.startSession();
      QuiqChatClient.joinChat();
    } else {
      this.updateContainerHidden(true);
      QuiqChatClient.leaveChat();
    }
  };

  render() {
    // Do not show chat no agents are available OR we're on a mobile device and no mobile number was provided in quiqOptions object
    if (isMobile() && !quiqOptions.mobileNumber) return null;

    return (
      <div className="Launcher">
        {<ChatContainer />}
        {/* <ToggleChatButton toggleChat={this.toggleChat} /> */}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state: ChatState) => ({
      chatContainerHidden: state.chatContainerHidden,
      initializedState: state.initializedState,
      transcript: state.transcript,
      welcomeFormRegistered: state.welcomeFormRegistered,
    }),
    chatActions
  ),
)(Launcher);
