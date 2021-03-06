/* eslint-disable */
/**
 * "orientationchange" Event Polyfill
 * by Jason LuBean
 *
 * This polyfill allows you to use "window.orientation"
 * and to bind to the "orientationchange" event.  It has
 * no dependencies on any libraries, but has support for
 * using jQuery to bind to the "orientationchange" event.
 *
 * Because IE8 does not allow you to use attachEvent /
 * fireEvent for custom events, you have to set the
 * window.onorientationchange function:
 *
 *  function handler() {
 *    //Do something useful when orientation changes
 *  }
 *
 *  if(window.addEventListener) {
 *    window.addEventListener("orientationchange",
 *      handler, false);
 *  } else {
 *      window.onorientationchange = handler;
 *  }
 *
 * If you use jQuery:
 *
 *  $(window).on('orientationchange', handler);
 */

if (typeof window.orientation === 'undefined') {
  var lastOrientation = -1,
    orientationEventType = 'orientationchange',
    resizeEventType = 'resize';

  // Set orientation to landscape (90) if width > height
  // Set orientation to portait (0) if width <= height
  // Use document.body.offsetWidth for IE

  function getOrientation() {
    var ornttn =
      window.outerWidth > 0
        ? window.outerWidth > window.outerHeight ? 90 : 0
        : document.body.offsetWidth > document.body.offsetHeight ? 90 : 0;

    return ornttn;
  }

  // Dispatch/fire the "orientationchange" event when the
  // width==height boundary is crossed.

  function handleResize() {
    var evt;
    window.orientation = getOrientation();
    if (window.orientation != lastOrientation) {
      lastOrientation = window.orientation;
      if (document.createEvent) {
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(orientationEventType, true, true);
        window.dispatchEvent(evt);
      } else {
        evt = document.createEventObject();
        evt.eventType = orientationEventType;
        evt.eventName = orientationEventType;
        if (window[orientationEventType]) {
          window[orientationEventType]();
        } else if (window['on' + orientationEventType]) {
          window['on' + orientationEventType]();
        } else if (typeof jQuery == 'function') {
          $(window).trigger(orientationEventType);
        }
      }
    }
  }

  //Listen for the window "resize" event

  if (window.addEventListener) window.addEventListener(resizeEventType, handleResize, false);
  else window['on' + resizeEventType] = handleResize;

  //Initialize the orientation

  window.orientation = getOrientation();
}
/* eslint-disable */
