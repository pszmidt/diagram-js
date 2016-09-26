export default {
  __depends__: [
    require('../move').default,
    require('../label-support').default
  ],
  __init__: [ 'attachSupport'],
  attachSupport: [ 'type', require('./AttachSupport').default ]
};
