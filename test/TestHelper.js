'use strict';

import { readFileSync } from 'fs';

import {
  inject,
  bootstrapDiagram,
  getDiagramJS,
  insertCSS,
  DomMocking
} from './helper';

import BoundsMatchers from './matchers/BoundsMatchers';
import ConnectionMatchers from './matchers/ConnectionMatchers';

export {
  insertCSS,
  bootstrapDiagram,
  getDiagramJS,
  inject,
  DomMocking
};

// make sinon fake timers work with lodash #debounce, #now
// and friends by overriding the native Date#now.
//
// it would otherwise be cached by lodash in `lodash/date/now`
Date.now = function() {
  return new Date().getTime();
};

insertCSS('diagram-js.css', readFileSync(__dirname + '/../assets/diagram-js.css', 'utf8'));

insertCSS('diagram-js-testing.css',
  '.test-container .result { height: 500px; }' + '.test-container > div'
);


// add suite specific matchers
global.chai.use(BoundsMatchers);
global.chai.use(ConnectionMatchers);