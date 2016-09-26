'use strict';

import { assign } from 'lodash-es';

import inherits from 'inherits';

import Refs from 'object-refs';

const parentRefs = new Refs(
  { name: 'children', enumerable: true, collection: true },
  { name: 'parent' }
);

const labelRefs = new Refs(
  { name: 'label', enumerable: true },
  { name: 'labelTarget' }
);

const attacherRefs = new Refs(
  { name: 'attachers', collection: true },
  { name: 'host' }
);

const outgoingRefs = new Refs(
  { name: 'outgoing', collection: true },
  { name: 'source' }
);

const incomingRefs = new Refs(
  { name: 'incoming', collection: true },
  { name: 'target' }
);

/**
 * @namespace djs.model
 */

/**
 * @memberOf djs.model
 */

/**
 * The basic graphical representation
 *
 * @class
 *
 * @abstract
 */
export function BaseElement() {

  /**
   * The object that backs up the shape
   *
   * @name BaseElement#businessObject
   * @type Object
   */
  Object.defineProperty(this, 'businessObject', {
    writable: true
  });

  /**
   * The parent shape
   *
   * @name BaseElement#parent
   * @type Shape
   */
  parentRefs.bind(this, 'parent');

  /**
   * @name BaseElement#label
   * @type Label
   */
  labelRefs.bind(this, 'label');

  /**
   * The list of outgoing connections
   *
   * @name BaseElement#outgoing
   * @type Array<Connection>
   */
  outgoingRefs.bind(this, 'outgoing');

  /**
   * The list of incoming connections
   *
   * @name BaseElement#incoming
   * @type Array<Connection>
   */
  incomingRefs.bind(this, 'incoming');
}


/**
 * A graphical object
 *
 * @class
 * @constructor
 *
 * @extends BaseElement
 */
export function Shape() {
  BaseElement.call(this);

  /**
   * The list of children
   *
   * @name Shape#children
   * @type Array<BaseElement>
   */
  parentRefs.bind(this, 'children');

  /**
   * @name Shape#host
   * @type Shape
   */
  attacherRefs.bind(this, 'host');

  /**
   * @name Shape#attachers
   * @type Shape
   */
  attacherRefs.bind(this, 'attachers');
}

inherits(Shape, BaseElement);


/**
 * A root graphical object
 *
 * @class
 * @constructor
 *
 * @extends Shape
 */
export function RootElement() {
  Shape.call(this);
}

inherits(RootElement, Shape);


/**
 * A label for an element
 *
 * @class
 * @constructor
 *
 * @extends Shape
 */
export function Label() {
  Shape.call(this);

  /**
   * The labeled element
   *
   * @name Label#labelTarget
   * @type BaseElement
   */
  labelRefs.bind(this, 'labelTarget');
}

inherits(Label, Shape);


/**
 * A connection between two elements
 *
 * @class
 * @constructor
 *
 * @extends BaseElement
 */
export function Connection() {
  BaseElement.call(this);

  /**
   * The element this connection originates from
   *
   * @name Connection#source
   * @type BaseElement
   */
  outgoingRefs.bind(this, 'source');

  /**
   * The element this connection points to
   *
   * @name Connection#target
   * @type BaseElement
   */
  incomingRefs.bind(this, 'target');
}

inherits(Connection, BaseElement);


const TYPES = {
  connection: Connection,
  shape: Shape,
  label: Label,
  root: RootElement
};

/**
 * Creates a new model element of the specified type
 *
 * @method create
 *
 * @example
 *
 * var shape1 = Model.create('shape', { x: 10, y: 10, width: 100, height: 100 });
 * var shape2 = Model.create('shape', { x: 210, y: 210, width: 100, height: 100 });
 *
 * var connection = Model.create('connection', { waypoints: [ { x: 110, y: 55 }, {x: 210, y: 55 } ] });
 *
 * @param  {String} type lower-cased model name
 * @param  {Object} attrs attributes to initialize the new model instance with
 *
 * @return {BaseElement} the new model instance
 */
export function create(type, attrs) {
  var Type = TYPES[type];
  if (!Type) {
    throw new Error('unknown type: <' + type + '>');
  }
  return assign(new Type(), attrs);
}