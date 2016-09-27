export default {
  __depends__: [ require('../interaction-events').default ],
  __init__: [ 'touchInteractionEvents' ],
  touchInteractionEvents: [ 'type', require('./TouchInteractionEvents').default ],
  touchFix: [ 'type', require('./TouchFix').default ]
};