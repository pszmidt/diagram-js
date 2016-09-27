export default {
  __depends__: [
    require('../../command').default,
    require('../change-support').default,
    require('../selection').default,
    require('../rules').default
  ],
  __init__: [ 'modeling' ],
  modeling: [ 'type', require('./Modeling').default ],
  layouter: [ 'type', require('../../layout/BaseLayouter').default ]
};
