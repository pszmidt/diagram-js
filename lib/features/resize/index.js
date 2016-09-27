export default {
  __depends__: [
    require('../rules').default,
    require('../dragging').default,
    require('../preview-support').default
  ],
  __init__: [
    'resize',
    'resizePreview',
    'resizeHandles'
  ],
  resize: [ 'type', require('./Resize').default ],
  resizePreview: [ 'type', require('./ResizePreview').default ],
  resizeHandles: [ 'type', require('./ResizeHandles').default ]
};
