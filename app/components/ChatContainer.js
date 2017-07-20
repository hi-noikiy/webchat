// @flow
import React from 'react';
import QUIQ, {validateWelcomeFormDefinition} from 'utils/quiq';
import {inStandaloneMode} from 'utils/utils';
import classnames from 'classnames';
import messages from 'messages';
import WelcomeForm from 'WelcomeForm';
import MessageForm from 'MessageForm';
import HeaderMenu from 'HeaderMenu';
import Transcript from 'Transcript';
import {getChatClient} from '../ChatClient';
import Spinner from 'Spinner';
import {formatMessage} from 'utils/i18n';
import {connect} from 'react-redux';
import {ChatInitializedState} from 'appConstants';
import './styles/ChatContainer.scss';
import type {ChatState, ChatInitializedStateType} from 'types';

export type ChatContainerProps = {
  chatContainerHidden: boolean,
  welcomeFormSubmitted: boolean,
  initializedState: ChatInitializedStateType,
};

export class ChatContainer extends React.Component {
  props: ChatContainerProps;

  componentDidMount() {
    if (!this.props.welcomeFormSubmitted) validateWelcomeFormDefinition();
  }

  renderBanner = () => {
    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
      case ChatInitializedState.LOADING:
      case ChatInitializedState.UNINITIALIZED:
        return (
          <div className="banner" style={{backgroundColor: QUIQ.COLOR}}>
            <span className="messageUs" style={{fontFamily: QUIQ.FONT_FAMILY}}>
              {QUIQ.HEADER_TEXT}
            </span>
          </div>
        );
      case ChatInitializedState.DISCONNECTED:
        return (
          <div className="errorBanner" style={{fontFamily: QUIQ.FONT_FAMILY}}>
            {formatMessage(messages.reconnecting)}
          </div>
        );
      case ChatInitializedState.ERROR:
      default:
        return (
          <div className="errorBanner">
            {formatMessage(messages.errorState)}
          </div>
        );
    }
  };

  renderContent = () => {
    switch (this.props.initializedState) {
      case ChatInitializedState.INITIALIZED:
        return (
          <div className="chatContainerBody">
            <Transcript />
            <MessageForm />
          </div>
        );
      case ChatInitializedState.UNINITIALIZED:
      case ChatInitializedState.LOADING:
        return (
          <div className="chatContainerBody">
            <Spinner />
          </div>
        );
      case ChatInitializedState.DISCONNECTED:
      case ChatInitializedState.ERROR:
      default:
        return (
          <div className="chatContainerBody">
            <Transcript />
          </div>
        );
    }
  };

  render() {
    if (this.props.chatContainerHidden) return null;

    const classNames = classnames(`ChatContainer ${this.props.initializedState}`, {
      standaloneMode: inStandaloneMode(),
      hasCustomLauncher: !inStandaloneMode() && QUIQ.CUSTOM_LAUNCH_BUTTONS.length > 0,
    });

    if (
      this.props.initializedState === ChatInitializedState.INITIALIZED &&
      !this.props.welcomeFormSubmitted &&
      !getChatClient().isRegistered()
    ) {
      return (
        <div className={classNames} style={{width: QUIQ.WIDTH, maxHeight: QUIQ.HEIGHT}}>
          <WelcomeForm />
        </div>
      );
    }

    return (
      <div className={classNames} style={{width: QUIQ.WIDTH, maxHeight: QUIQ.HEIGHT}}>
        <HeaderMenu />
        {this.renderBanner()}
        {this.renderContent()}
      </div>
    );
  }
}

export default connect((state: ChatState) => ({
  chatContainerHidden: state.chatContainerHidden,
  initializedState: state.initializedState,
  welcomeFormSubmitted: state.welcomeFormSubmitted,
}))(ChatContainer);
