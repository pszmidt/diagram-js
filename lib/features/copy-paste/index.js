export default {
  __depends__: [
    require('../clipboard').default,
    require('../rules').default,
    require('../mouse-tracking').default
  ],
  __init__: [ 'copyPaste' ],
  copyPaste: [ 'type', require('./CopyPaste').default ]
};
