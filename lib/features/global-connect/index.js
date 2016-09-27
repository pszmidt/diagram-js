export default {
  __depends__: [
    require('../connect').default,
    require('../rules').default,
    require('../dragging').default,
    require('../tool-manager').default
  ],
  globalConnect: [ 'type', require('./GlobalConnect').default ]
};
