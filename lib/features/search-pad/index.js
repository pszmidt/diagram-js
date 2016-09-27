export default {
  __depends__: [
    require('../overlays').default,
    require('../selection').default
  ],
  searchPad: [ 'type', require('./SearchPad').default ]
};
