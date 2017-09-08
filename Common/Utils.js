// @flow
declare var __DEV__: string;
declare var QuiqModernizr: Object;

import messages from 'Common/Messages';
import {SupportedWebchatUrls} from './Constants';
import {UAParser} from 'ua-parser-js';
import './modernizr';
import type {BrowserNames, DeviceTypes, OSNames, BrowserEngine} from './types';

const parser = new UAParser();

export const getBrowserName = (): BrowserNames => parser.getResult().browser.name;

export const getEngineName = (): BrowserEngine => parser.getResult().engine.name;

export const getEngineVersion = (): number => parseInt(parser.getResult().engine.version, 10);

export const getMajor = (): number => parseInt(parser.getResult().browser.major, 10);

export const getDeviceType = (): DeviceTypes => parser.getResult().device.type;

export const getOSName = (): OSNames => parser.getResult().os.name;

export const getUAInfo = () => parser.getResult();

export const compatibilityMode = () => {
  const compatList = [
    {
      name: 'IE',
      major: 10,
    },
  ];
  const {name, major} = parser.getResult().browser;
  return !!compatList.find(i => i.name === name && parseInt(major, 10) <= i.major);
};

export const isMobile = () => getDeviceType() === 'mobile';

export const getCalcStyle = (val1: number | string, val2: number | string, operand: string) => {
  const expression = `calc(${val1} ${operand} ${val2})`;
  switch (getEngineName()) {
    case 'WebKit':
      // Later versions of Safari and Chrome do not need vendor prefix
      if ((getBrowserName() === 'Safari' && getMajor() >= 7) || (getBrowserName() === 'Chrome' && getMajor() >= 26)) {
        return expression;
      } else {
        return `-webkit-${expression}`;
      }
    case 'Gecko':
      // Later versions of Gecko engine must not be vendor prefixed
      if (getEngineVersion() >= 16) {
        return expression;
      } else {
        return `-moz-${expression}`;
      }
    default:
      return expression;
  }
};

export const getWebchatHostFromScriptTag = () => {
  // Determine host from the script tag that loaded webchat
  const scriptTags = Array.from(document.getElementsByTagName('script'));

  const mainScript = scriptTags.find(
    tag => tag.src && SupportedWebchatUrls.find(u => tag.src.toLowerCase().includes(u)),
  );

  if (!mainScript)
    return displayError('Unable to locate Quiq script tag for determining chat host.');

  const webchatUrl = mainScript.src;
  return webchatUrl.slice(0, webchatUrl.indexOf('/app/webchat'));
};

export const getWindowDomain = () => `${window.location.protocol}//${window.location.host}`;

export const isIFrame = (chatWindow: Object): boolean => {
  return chatWindow instanceof HTMLElement && chatWindow.tagName.toLowerCase() === 'iframe';
};

export const camelizeToplevelScreamingSnakeCaseKeys = (obj: Object) => {
  const newObject = {};
  Object.keys(obj).forEach(key => {
    const newKey = camelize(key.toLowerCase());
    newObject[newKey] = obj[key];
  });
  return newObject;
};

export const getHostingWindow = () => {
  if (!window.opener && window.parent === window.self) {
    displayError('Unable to find iframe or window containing webchat');
  }

  return window.opener || window.parent;
};

export const isIE9 = () => getBrowserName() === 'IE' && getMajor() <= 9;
export const isIE10 = () => getBrowserName() === 'IE' && getMajor() === 10;

export const nonCompatibleBrowser = () => getBrowserName() === 'IE' && getMajor() < 9;
// QuiqModernizr says IE10 doesn't support flexbox.
// It kind of does, at least for what we need it for... so go ahead and ignore QuiqModernizr in that case
export const supportsFlexbox = () => isIE10() || (QuiqModernizr.flexbox && QuiqModernizr.flexwrap);
export const supportsSVG = () =>
  QuiqModernizr.svg && QuiqModernizr.svgfilters && QuiqModernizr.inlinesvg;

export const displayError = (error: string, values: {[string]: string} = {}) => {
  throw new Error(buildTemplateString(error, values));
};

export const displayWarning = (error: string, values: {[string]: string} = {}) => {
  console.warn(buildTemplateString(error, values));
};

// If window.opener is not null, then we're in a popup.
export const inStandaloneMode = () => !!window.opener;

export const getWebchatUrlFromScriptTag = () => {
  // Determine host from the script tag that loaded webchat
  const scriptTags = Array.from(document.getElementsByTagName('script'));

  const mainScript = scriptTags.find(
    tag => tag.src && SupportedWebchatUrls.find(u => tag.src.toLowerCase().includes(u)),
  );

  if (!mainScript) return displayError(messages.cannotFindScript);

  return mainScript.src;
};

export const camelize = (str: string) =>
  str
    .replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (ltr, idx) => (idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()),
    )
    .replace(/\s+/g, '');

export const inNonProductionCluster = () =>
  !!window.location.hostname.match(
    /.*[.-](dev|qa|perf)\.(centricient\.corp|quiq\.sh|goquiq\.com)/g,
  );

export const inLocalDevelopment = () =>
  __DEV__ || !!window.location.hostname.match(/.*\.(centricient|quiq)\.dev/g);

export const getQuiqKeysFromLocalStorage = (): {[string]: any} => {
  if (!localStorage) return {};
  const keys = {
    'X-Quiq-Access-Token': localStorage.getItem('X-Quiq-Access-Token'),
    'quiq-chat-container-visible': localStorage.getItem('quiq-chat-container-visible'),
    'quiq-tracking-id': localStorage.getItem('quiq-tracking-id'),
    'quiq-user-taken-meaningful-action': localStorage.getItem('quiq-user-taken-meaningful-action'),
    '__storejs_expire_mixin_X-Quiq-Access-Token': localStorage.getItem('__storejs_expire_mixin_X-Quiq-Access-Token'),
    '__storejs_expire_mixin_quiq-chat-container-visible': localStorage.getItem('__storejs_expire_mixin_quiq-chat-container-visible'),
    '__storejs_expire_mixin_quiq-tracking-id': localStorage.getItem('__storejs_expire_mixin_quiq-tracking-id'),
    '__storejs_expire_mixin_quiq-user-taken-meaningful-action': localStorage.getItem('__storejs_expire_mixin_quiq-user-taken-meaningful-action'),
  };

  // Remove null/undefined keys returned by localStorage.getItem()
  Object.keys(keys).forEach(k => {
    if (!keys[k]) delete keys[k];
  });

  return keys;
};

export const setLocalStorageItems = (data: {[string]: any}) => {
  if (!localStorage) return;
  Object.keys(data).forEach(k => {
    localStorage.setItem(k, data[k]);
  });
};

export const clearQuiqKeysFromLocalStorage = () => {
  const keys = [
    'X-Quiq-Access-Token',
    'quiq-chat-container-visible',
    'quiq-tracking-id',
    'quiq-user-taken-meaningful-action',
    '__storejs_expire_mixin_X-Quiq-Access-Token',
    '__storejs_expire_mixin_quiq-chat-container-visible',
    '__storejs_expire_mixin_quiq-tracking-id',
    '__storejs_expire_mixin_quiq-user-taken-meaningful-action',
  ];

  if (!localStorage) return;

  keys.forEach(k => {
    localStorage.removeItem(k);
  })
};

// From https://stackoverflow.com/questions/377961/efficient-javascript-string-replacement
export const buildTemplateString = (s: string, values: {[string]: any}): string => {
  return s.replace(
    /{(\w*)}/g,
    (m: string, key: string) => {
      return values.hasOwnProperty( key ) ? values[key].toString() : "";
    }
  );
};