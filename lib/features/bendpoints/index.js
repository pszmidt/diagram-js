export default {
  __depends__: [
    require('../dragging').default,
    require('../rules').default
  ],
  __init__: [
    'bendpoints',
    'bendpointSnapping'
  ],
  bendpoints: [ 'type', require('./Bendpoints').default ],
  bendpointMove: [ 'type', require('./BendpointMove').default ],
  connectionSegmentMove: [ 'type', require('./ConnectionSegmentMove').default ],
  bendpointSnapping: [ 'type', require('./BendpointSnapping').default ]
};
