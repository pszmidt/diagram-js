export default {
  __depends__: [
    require('../selection').default,
    require('../copy-paste').default,
    require('../../navigation/zoomscroll').default
  ],
  __init__: [ 'editorActions' ],
  editorActions: [ 'type', require('./EditorActions').default ]
};
