// @flow
/** @jsx h */
import {h} from 'preact';
import {getStyle} from 'Common/QuiqOptions';
import {getQuiqOptions} from 'Globals';
import {displayModes} from 'Common/Constants';
import './styles/ToggleChatButton.scss';

export type ToggleChatButtonProps = {
  onClick: () => void,
  open: boolean,
};

const ToggleChatButton = ({onClick, open}: ToggleChatButtonProps) => {
  const {styles, colors, displayMode} = getQuiqOptions();

  return (
    <button
      style={getStyle(styles.ToggleChatButton, {backgroundColor: colors.primary})}
      onClick={onClick}
      className="ToggleChatButton"
    >
      <svg
        style={getStyle(styles.ToggleChatButtonIcon)}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        {open && displayMode !== displayModes.UNDOCKED ? (
          <path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z" />
        ) : (
          <path d="M12 1c-6.628 0-12 4.573-12 10.213 0 2.39.932 4.591 2.427 6.164l-2.427 5.623 7.563-2.26c9.495 2.598 16.437-3.251 16.437-9.527 0-5.64-5.372-10.213-12-10.213z" />
        )}
      </svg>
    </button>
  );
};

export default ToggleChatButton;
