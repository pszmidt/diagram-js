export default {
  __depends__: [
    require('../interaction-events').default,
    require('../overlays').default
  ],
  contextPad: [ 'type', require('./ContextPad').default ]
};