export default {
  __depends__: [ require('../tool-manager').default ],
  __init__: [ 'handTool' ],
  handTool: [ 'type', require('./HandTool').default ]
};
