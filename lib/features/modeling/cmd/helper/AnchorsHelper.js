'use strict';

import {
  center as getCenter,
  delta as getDelta
} from '../../../../util/PositionUtil';

import { roundPoint } from '../../../../layout/LayoutUtil';


export function getResizedSourceAnchor(connection, shape, oldBounds) {

  var waypoints = safeGetWaypoints(connection),
      oldAnchor = waypoints[0];

  return getNewAttachPoint(oldAnchor.original || oldAnchor, oldBounds, shape);
}

export function getResizedTargetAnchor(connection, shape, oldBounds) {

  var waypoints = safeGetWaypoints(connection),
      oldAnchor = waypoints[waypoints.length - 1];

  return getNewAttachPoint(oldAnchor.original || oldAnchor, oldBounds, shape);
}

export function getMovedSourceAnchor(connection, source, moveDelta) {
  return getResizedSourceAnchor(connection, source, substractPosition(source, moveDelta));
}

export function getMovedTargetAnchor(connection, target, moveDelta) {
  return getResizedTargetAnchor(connection, target, substractPosition(target, moveDelta));
}

/**
 * Calculates the absolute point relative to the new element's position
 *
 * @param {point} point [absolute]
 * @param {bounds} oldBounds
 * @param {bounds} newBounds
 *
 * @return {point} point [absolute]
 */
export function getNewAttachPoint(point, oldBounds, newBounds) {
  var oldCenter = getCenter(oldBounds),
      newCenter = getCenter(newBounds),
      oldDelta = getDelta(point, oldCenter);

  var newDelta = {
    x: oldDelta.x * (newBounds.width / oldBounds.width),
    y: oldDelta.y * (newBounds.height / oldBounds.height)
  };

  return roundPoint({
    x: newCenter.x + newDelta.x,
    y: newCenter.y + newDelta.y
  });
}


//////// helpers ////////////////////////////////////

function substractPosition(bounds, delta) {
  return {
    x: bounds.x - delta.x,
    y: bounds.y - delta.y,
    width: bounds.width,
    height: bounds.height
  };
}


/**
 * Return waypoints of given connection; throw if non exists (should not happen!!).
 *
 * @param {Connection} connection
 *
 * @return {Array<Point>}
 */
function safeGetWaypoints(connection) {

  var waypoints = connection.waypoints;

  if (!waypoints.length) {
    throw new Error('connection#' + connection.id + ': no waypoints');
  }

  return waypoints;
}