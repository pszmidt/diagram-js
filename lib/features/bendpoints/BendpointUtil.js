'use strict';

import { getMidPoint, pointsAligned } from '../../util/Geometry';

import Snap from '../../../vendor/snapsvg';

export const BENDPOINT_CLS = 'djs-bendpoint';
export const SEGMENT_DRAGGER_CLS = 'djs-segment-dragger';


export function addBendpoint(parentGfx, cls) {
  var groupGfx = parentGfx.group().addClass(BENDPOINT_CLS);

  groupGfx.circle(0, 0, 4).addClass('djs-visual');
  groupGfx.circle(0, 0, 10).addClass('djs-hit');

  if (cls) {
    groupGfx.addClass(cls);
  }

  return groupGfx;
}

function createParallelDragger(parentGfx, position, alignment) {
  var draggerGfx = parentGfx.group();

  var width = 14,
      height = 3,
      padding = 6,
      hitWidth = width + padding,
      hitHeight = height + padding;

  draggerGfx.rect(-width / 2, -height / 2, width, height).addClass('djs-visual');
  draggerGfx.rect(-hitWidth / 2, -hitHeight / 2, hitWidth, hitHeight).addClass('djs-hit');

  var matrix = new Snap.Matrix().rotate(alignment === 'h' ? 90 : 0, 0, 0);

  draggerGfx.transform(matrix);

  return draggerGfx;
}


export function addSegmentDragger(parentGfx, segmentStart, segmentEnd) {

  var groupGfx = parentGfx.group(),
      mid = getMidPoint(segmentStart, segmentEnd),
      alignment = pointsAligned(segmentStart, segmentEnd);

  createParallelDragger(groupGfx, mid, alignment);

  groupGfx.addClass(SEGMENT_DRAGGER_CLS);
  groupGfx.addClass(alignment === 'h' ? 'vertical' : 'horizontal');
  groupGfx.translate(mid.x, mid.y);

  return groupGfx;
}