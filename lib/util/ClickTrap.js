'use strict';

import domEvent from 'min-dom/lib/event';

import { stopEvent } from './Event';

function trap(event) {
  stopEvent(event);

  toggle(false);
}

function toggle(active) {
  domEvent[active ? 'bind' : 'unbind'](document.body, 'click', trap, true);
}

/**
 * Installs a click trap that prevents a
 * ghost click following a dragging operation.
 *
 * @return {Function} a unbind function
 */
export default function trapClick() {

  toggle(true);

  return function() {
    toggle(false);
  };
}