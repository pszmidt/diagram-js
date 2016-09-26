'use strict';

import { assign } from 'lodash-es';


/**
 * A handler that implements reversible moving of shapes.
 */
export default function LayoutConnectionHandler(layouter, canvas) {
  this._layouter = layouter;
  this._canvas = canvas;
}

LayoutConnectionHandler.$inject = [ 'layouter', 'canvas' ];


LayoutConnectionHandler.prototype.execute = function(context) {

  var connection = context.connection,
      parent = connection.parent,
      connectionSiblings = parent.children;

  var oldIndex = connectionSiblings.indexOf(connection);

  var oldWaypoints = connection.waypoints;

  assign(context, {
    oldWaypoints: oldWaypoints,
    oldIndex: oldIndex
  });

  connection.waypoints = this._layouter.layoutConnection(connection, context.hints);

  return connection;
};

LayoutConnectionHandler.prototype.revert = function(context) {

  var connection = context.connection,
      parent = connection.parent,
      connectionSiblings = parent.children,
      currentIndex = connectionSiblings.indexOf(connection),
      oldIndex = context.oldIndex;

  connection.waypoints = context.oldWaypoints;

  if (oldIndex !== currentIndex) {

    // change position of connection in shape
    connectionSiblings.splice(currentIndex, 1);
    connectionSiblings.splice(oldIndex, 0, connection);
  }

  return connection;
};