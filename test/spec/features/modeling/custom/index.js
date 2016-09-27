module.exports = {
  __depends__: [
    require('../../../../../lib/command').default,
    require('../../../../../lib/features/change-support').default,
    require('../../../../../lib/features/selection').default,
    require('../../../../../lib/features/rules').default
  ],
  __init__: [ 'modeling' ],
  modeling: [ 'type', require('../../../../../lib/features/modeling/Modeling').default ],
  layouter: [ 'type', require('./CustomLayouter').default ]
};
