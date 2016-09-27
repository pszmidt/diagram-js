export default {
  __depends__: [
    require('../interaction-events').default,
    require('../selection').default,
    require('../outline').default,
    require('../rules').default,
    require('../dragging').default,
    require('../preview-support').default
  ],
  __init__: [ 'move', 'movePreview' ],
  move: [ 'type', require('./Move').default ],
  movePreview: [ 'type', require('./MovePreview').default ]
};
