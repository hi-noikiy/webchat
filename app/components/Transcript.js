import React, {Component} from 'react';
import Message from 'Message/Message';
import PlatformEvent from './PlatformEvent';
import quiqOptions from 'Common/QuiqOptions';
import {connect} from 'react-redux';
import {getTranscript, getPlatformEvents} from 'reducers/chat';
import type {Message as MessageType, ChatState, Event} from 'Common/types';
import './styles/Transcript.scss';

export type TranscriptProps = {
  transcript: Array<MessageType>,
  platformEvents: Array<Event>,
};

export class Transcript extends Component {
  props: TranscriptProps;
  scrollLock: boolean = false;
  transcript: HTMLElement;

  componentDidMount() {
    if (!this.isUsingCustomWaitScreen()) {
      this.scrollToBottom();
    }

    // Listen for scroll, set scrollLock flag
    if (this.transcript) {
      this.transcript.addEventListener(
        'wheel',
        () => {
          this.scrollLock = true;
        },
        {passive: true},
      );
    }
  }

  scrollToBottom = () => {
    if (!this.transcript || this.scrollLock) return;

    this.transcript.scrollTop = this.transcript.scrollHeight;
  };

  componentDidUpdate(prevProps) {
    // Scroll to the bottom if you get a new message
    if (this.props.transcript.length > prevProps.transcript.length) {
      this.scrollLock = false;
      this.scrollToBottom();
    }
  }

  handleIFrameLoad = () => {
    this.scrollToBottom();
  };

  isUsingCustomWaitScreen = () => {
    return quiqOptions.customHeaderScreenUrl && quiqOptions.customHeaderScreenUrl.length > 0;
  };

  handleScrollToBottom = () => {
    if (!this.isUsingCustomWaitScreen()) {
      this.scrollToBottom();
    }
  };

  render() {
    const {colors} = quiqOptions;
    const messagesAndEvents = [...this.props.transcript, ...this.props.platformEvents].sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    return (
      <div
        className="Transcript"
        ref={n => {
          this.transcript = n;
        }}
        style={{backgroundColor: colors.transcriptBackground}}
      >
        {this.isUsingCustomWaitScreen() && (
          <iframe
            onLoad={this.handleIFrameLoad}
            style={{
              minHeight: quiqOptions.customHeaderScreenHeight,
              borderWidth: 0,
            }}
            height={quiqOptions.customHeaderScreenHeight}
            src={quiqOptions.customHeaderScreenUrl}
          />
        )}

        {messagesAndEvents.map(a => {
          if (a.type === 'Attachment' || a.type === 'Text') {
            return (
              <Message
                key={a.localKey || a.id}
                message={a}
                scrollToBottom={this.handleScrollToBottom}
              />
            );
          }

          return <PlatformEvent event={a} key={a.id} />;
        })}
      </div>
    );
  }
}

export default connect((state: ChatState) => ({
  transcript: getTranscript(state),
  platformEvents: getPlatformEvents(state),
}))(Transcript);
