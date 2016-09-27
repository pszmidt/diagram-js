export default {
  __depends__: [
    require('../move').default
  ],
  __init__: [ 'labelSupport'],
  labelSupport: [ 'type', require('./LabelSupport').default ]
};
