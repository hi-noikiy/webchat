// @flow

import React from 'react';
import {connect} from 'react-redux';
import {getStyle} from 'Common/QuiqOptions';
import classnames from 'classnames';
import {getConfiguration} from 'reducers/chat';
import type {ChatConfiguration, ChatState} from 'Common/types';
import './styles/Avatar.scss';

export type AvatarProps = {
  url?: string,
  authorDisplayName?: string,
  forCustomer: boolean,
  configuration: ChatConfiguration,
};

export const Avatar = ({url, authorDisplayName, forCustomer = false, ...props}: AvatarProps) => {
  const customStyle = forCustomer
    ? props.configuration.styles.CustomerAvatar
    : props.configuration.styles.AgentAvatar;
  return (
    <div
      className={classnames('Avatar', {hasImage: !!url})}
      title={authorDisplayName}
      style={getStyle(customStyle, {
        marginLeft: url && forCustomer ? '5px' : 0,
        marginRight: url && !forCustomer ? '5px' : 0,
        backgroundImage: url && `url(${url})`,
      })}
    />
  );
};

export default connect(
  (state: ChatState) => ({
    configuration: getConfiguration(state),
  }),
  {},
)(Avatar);
