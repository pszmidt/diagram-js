'use strict';

import Snap from '../../vendor/snapsvg';


export function componentsToPath(elements) {
  return elements.join(',').replace(/,?([A-z]),?/g, '$1');
}

export function toSVGPoints(points) {
  var result = '';

  for (var i = 0, p; (p = points[i]); i++) {
    result += p.x + ',' + p.y + ' ';
  }

  return result;
}

export function createLine(points, attrs) {
  return Snap.create('polyline', { points: toSVGPoints(points) }).attr(attrs || {});
}

export function updateLine(gfx, points) {
  return gfx.attr({ points: toSVGPoints(points) });
}
