'use strict';

import {
  set as setCursor,
  unset as unsetCursor
} from '../../util/Cursor';

import trapClick from '../../util/ClickTrap';

import { pointSubstract, getLength } from '../../util/Math';

import domEvent from 'min-dom/lib/event';
import domClosest from 'min-dom/lib/closest';

import { toPoint } from '../../util/Event';


const THRESHOLD = 15;

export default function MoveCanvas(eventBus, canvas) {

  var container = canvas._container,
      context;


  function handleMove(event) {

    var start = context.start,
        position = toPoint(event),
        delta = pointSubstract(position, start);

    if (!context.dragging && getLength(delta) > THRESHOLD) {
      context.dragging = true;

      // prevent mouse click in this
      // interaction sequence
      trapClick();

      setCursor('grab');
    }

    if (context.dragging) {

      var lastPosition = context.last || context.start;

      delta = pointSubstract(position, lastPosition);

      canvas.scroll({
        dx: delta.x,
        dy: delta.y
      });

      context.last = position;
    }

    // prevent select
    event.preventDefault();
  }  function handleEnd(event) {
    domEvent.unbind(document, 'mousemove', handleMove);
    domEvent.unbind(document, 'mouseup', handleEnd);

    context = null;

    unsetCursor();
  }

  function handleStart(event) {
    // event is already handled by '.djs-draggable'
    if (domClosest(event.target, '.djs-draggable')) {
      return;
    }


    // reject non-left left mouse button or modifier key
    if (event.button || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    context = {
      start: toPoint(event)
    };

    domEvent.bind(document, 'mousemove', handleMove);
    domEvent.bind(document, 'mouseup', handleEnd);
  }

  domEvent.bind(container, 'mousedown', handleStart);
}

MoveCanvas.$inject = [ 'eventBus', 'canvas' ];