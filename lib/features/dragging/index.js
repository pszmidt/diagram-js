export default {
  __init__: [
    'hoverFix'
  ],
  __depends__: [
    require('../selection').default
  ],
  dragging: [ 'type', require('./Dragging').default ],
  hoverFix: [ 'type', require('./HoverFix').default ]
};