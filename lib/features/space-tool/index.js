export default {
  __init__: ['spaceToolPreview'],
  __depends__: [
    require('../dragging').default,
    require('../rules').default,
    require('../tool-manager').default,
    require('../preview-support').default
  ],
  spaceTool: ['type', require('./SpaceTool').default ],
  spaceToolPreview: ['type', require('./SpaceToolPreview').default ]
};
