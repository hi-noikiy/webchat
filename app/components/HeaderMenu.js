// @flow
import React from 'react';
import {inStandaloneMode, isIEorSafari} from 'utils/utils';
import QUIQ, {openStandaloneMode, getMessage} from 'utils/quiq';
import {messageTypes, ChatInitializedState} from 'appConstants';
import {setChatContainerHidden, setChatPopped} from 'actions/chatActions';
import {connect} from 'react-redux';
import {getChatClient} from '../ChatClient';
import type {ChatState, ChatInitializedStateType} from 'types';
import './styles/HeaderMenu.scss';

export type HeaderMenuProps = {
  initializedState: ChatInitializedStateType,
  setChatContainerHidden: (chatContainerHidden: boolean) => void, // eslint-disable-line react/no-unused-prop-types
  setChatPopped: (popped: boolean) => void, // eslint-disable-line react/no-unused-prop-types
};

export const HeaderMenu = (props: HeaderMenuProps) => {
  const minimize = () => {
    props.setChatContainerHidden(true);
    getChatClient().leaveChat();
  };

  const popChat = () => {
    openStandaloneMode({
      onPop: () => {
        props.setChatPopped(true);
      },
      onFocus: () => {
        props.setChatPopped(true);
      },
      onDock: () => {
        props.setChatPopped(false);
        if (isIEorSafari()) {
          getChatClient().leaveChat();
        }
      },
    });
  };

  return (
    <div className="HeaderMenu" style={{backgroundColor: QUIQ.COLOR}}>
      <div className="buttons">
        {!isIEorSafari() &&
          <i
            className={`fa fa-window-minimize icon`}
            title={getMessage(messageTypes.minimizeWindowTooltip)}
            onClick={inStandaloneMode() ? window.close : minimize}
          />}
        {!isIEorSafari() &&
          props.initializedState !== ChatInitializedState.BURNED &&
          <i
            className={`fa fa-${inStandaloneMode() ? 'window-restore' : 'window-maximize'} icon`}
            title={getMessage(
              inStandaloneMode()
                ? messageTypes.dockWindowTooltip
                : messageTypes.openInNewWindowTooltip,
            )}
            onClick={inStandaloneMode() ? window.close : popChat}
          />}
        <i
          className={`fa fa-times icon`}
          title={getMessage(messageTypes.closeWindowTooltip)}
          onClick={inStandaloneMode() ? window.close : minimize}
        />
      </div>
    </div>
  );
};

export default connect(
  (state: ChatState) => ({
    initializedState: state.initializedState,
  }),
  {setChatContainerHidden, setChatPopped},
)(HeaderMenu);
