export default {
  __depends__: [
    require('../dragging').default,
    require('../selection').default,
    require('../rules').default
  ],
  create: [ 'type', require('./Create').default ]
};
