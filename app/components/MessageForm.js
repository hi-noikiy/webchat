// @flow
import React, {Component} from 'react';
import TypingIndicator from 'TypingIndicator';
import {compatibilityMode, supportsFlexbox} from 'utils/utils';
import QUIQ from 'utils/quiq';
import keycodes from 'keycodes';
import Textarea from 'react-textarea-autosize';
import messages from 'messages';
import {formatMessage} from 'utils/i18n';
import {getChatClient} from '../ChatClient';
import './styles/MessageForm.scss';

const {COLOR, FONT_FAMILY} = QUIQ;

export type MessageFormProps = {
  agentTyping: boolean,
};

type MessageFormState = {
  text: string,
};

let updateTimer;
export class MessageForm extends Component {
  textArea: any;
  props: MessageFormProps;
  state: MessageFormState = {
    text: '',
  };

  componentDidMount() {
    setTimeout(() => {
      if (this.textArea) {
        this.textArea.focus();
      }
    }, 200);
  }

  startTyping = () => {
    const chatClient = getChatClient();
    chatClient.updateMessagePreview(this.state.text, true);
    updateTimer = undefined;
  };

  stopTyping = () => {
    const chatClient = getChatClient();
    chatClient.updateMessagePreview(this.state.text, false);
  };

  startTypingTimers = () => {
    if (!updateTimer) {
      updateTimer = setTimeout(this.startTyping, 2000);
    }
  };

  resetTypingTimers = () => {
    clearTimeout(updateTimer);
    updateTimer = undefined;
    this.stopTyping();
  };

  handleTextChanged = (e: SyntheticInputEvent) => {
    const state = Object.assign({
      text: e.target.value,
    });

    this.setState(state, e.target.value ? this.startTypingTimers : this.resetTypingTimers);
  };

  addMessage = () => {
    const chatClient = getChatClient();
    const text = this.state.text.trim();
    if (text) {
      this.setState({text: ''}, this.resetTypingTimers);
      chatClient.sendMessage(text);
    }
  };

  handleKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.keyCode === keycodes.enter) {
      e.preventDefault();
      this.addMessage();
    }
  };

  render() {
    const sendDisabled = this.state.text.trim() === '';
    const compatMode = compatibilityMode();

    return (
      <div className="MessageForm">
        {(!supportsFlexbox() || this.props.agentTyping) &&
          <div className="poke">
            {this.props.agentTyping &&
              <div className="pokeBody">
                <span style={{fontFamily: FONT_FAMILY}}>
                  {formatMessage(messages.agentIsTyping)}
                </span>
                <TypingIndicator yScale={0.5} xScale={0.75} />
              </div>}
          </div>}

        <div className="messageArea">
          <Textarea
            inputRef={n => {
              this.textArea = n;
            }}
            style={{fontFamily: FONT_FAMILY}}
            name="message"
            value={this.state.text}
            maxRows={supportsFlexbox() ? 6 : 3}
            minRows={supportsFlexbox() ? 1 : 3}
            // onInput is more responsive, but is an html5 attribute so not supported in older browsers.
            onInput={compatMode ? undefined : this.handleTextChanged}
            onChange={compatMode ? this.handleTextChanged : undefined}
            onKeyDown={this.handleKeyDown}
            placeholder={formatMessage(messages.sendUsAMessage)}
          />
          <button
            className="sendBtn"
            onClick={this.addMessage}
            disabled={sendDisabled}
            style={{color: COLOR, opacity: sendDisabled ? '.5' : '1', fontFamily: FONT_FAMILY}}
          >
            {formatMessage(messages.send)}
          </button>
        </div>
      </div>
    );
  }
}

export default MessageForm;
