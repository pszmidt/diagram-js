export default {
  __depends__: [
    require('../dragging').default,
    require('../mouse-tracking').default
  ],
  __init__: [ 'autoScroll' ],
  autoScroll: [ 'type', require('./AutoScroll').default ]
};