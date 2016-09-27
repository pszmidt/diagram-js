export default {
  __init__: [
    'selectionVisuals',
    'selectionBehavior'
  ],
  __depends__: [
    require('../interaction-events').default,
    require('../outline').default
  ],
  selection: [ 'type', require('./Selection').default ],
  selectionVisuals: [ 'type', require('./SelectionVisuals').default ],
  selectionBehavior: [ 'type', require('./SelectionBehavior').default ]
};
