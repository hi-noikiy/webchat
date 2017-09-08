// @flow

import {buildTemplateString} from 'Common/Utils';
import type {IntlObject, IntlMessage} from 'Common/types';

let intl;

/**
 * Registers the intl object exposed in injectIntl so that it can be used elsewhere
 */
export const registerIntlObject = (intlObject: IntlObject): void => {
  intl = intlObject;
};

/**
 * Passes values to the formatMessage function of the intl object
 * @param {object} message - The react-intl message to translate
 * @param {object=} values - An object of values to pass into formatMessage
 */
export const formatMessage = (message: IntlMessage, values: Object = {}): string => {
  if (!intl) {
    // Intl object not defined, fall back to returning default message
    return buildTemplateString(message.defaultMessage, values);
  }

  return intl.formatMessage(message, values);
};

/**
 * Passes value to formatDate function of the intl object
 * @param {number} value - The timestamp to format
 */
export const formatDate = (value: number): string => intl.formatDate(value);

/**
 * Passes value to formatTime function of the intl object
 * @param {number} timestamp - The timestamp to format
 * @param {object} options - options to pass
 */
export const formatTime = (timestamp: number, options?: Object) =>
  intl.formatTime(timestamp, options);

/**
 * @param {number} timestamp - timestamp to format
 * @return {String} - plain-text formatted date in the format of MM/DD/YY, HH:MM:SS AM/PM
 */
export const getFormattedDateAndTime = (timestamp: number): string =>
  formatTime(timestamp, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

export const getDisplayString = (message?: string | IntlMessage, values?: Object): string => {
  if (!message) return '';

  return typeof message === 'string' ? message : formatMessage(message, values);
};