'use strict';

import domClasses from 'min-dom/lib/classes';

const CURSOR_CLS_PATTERN = /^djs-cursor-.*$/;


export function set(mode) {
  var classes = domClasses(document.body);

  classes.removeMatching(CURSOR_CLS_PATTERN);

  if (mode) {
    classes.add('djs-cursor-' + mode);
  }
}

export function unset() {
  this.set(null);
}

export function has(mode) {
  var classes = domClasses(document.body);

  return classes.has('djs-cursor-' + mode);
}
