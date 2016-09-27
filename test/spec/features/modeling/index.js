module.exports = {
  __depends__: [
    require('../../../../lib/core').default,
    require('../../../../lib/cmd').default
  ],
  modeling: [ 'type', require('../../../../lib/features/modeling/Modeling').default ]
};
