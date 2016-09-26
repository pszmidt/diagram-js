export default {
  __init__: [ 'defaultRenderer' ],
  defaultRenderer: [ 'type', require('./DefaultRenderer').default ],
  styles: [ 'type', require('./Styles').default ]
};
