export default {
  __depends__: [ require('../draw').default ],
  __init__: [ 'canvas' ],
  canvas: [ 'type', require('./Canvas').default ],
  elementRegistry: [ 'type', require('./ElementRegistry').default ],
  elementFactory: [ 'type', require('./ElementFactory').default ],
  eventBus: [ 'type', require('./EventBus').default ],
  graphicsFactory: [ 'type', require('./GraphicsFactory').default ]
};