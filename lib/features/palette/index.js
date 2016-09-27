export default {
  __depends__: [ require('../tool-manager').default ],
  __init__: [ 'palette' ],
  palette: [ 'type', require('./Palette').default ]
};
