export default {
  __depends__: [ require('../dragging').default ],
  __init__: [ 'toolManager' ],
  toolManager: [ 'type', require('./ToolManager').default ]
};
