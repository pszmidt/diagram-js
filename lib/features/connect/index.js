export default {
  __depends__: [
    require('../selection').default,
    require('../rules').default,
    require('../dragging').default
  ],
  connect: [ 'type', require('./Connect').default ]
};
