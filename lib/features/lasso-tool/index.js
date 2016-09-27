export default {
  __depends__: [ require('../tool-manager').default ],
  __init__: [ 'lassoTool' ],
  lassoTool: [ 'type', require('./LassoTool').default ]
};
