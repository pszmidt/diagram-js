'use strict';

var isFunction = require('lodash/lang/isFunction'),
    isArray = require('lodash/lang/isArray'),
    forEach = require('lodash/collection/forEach');

var domify = require('min-dom/lib/domify'),
    domQuery = require('min-dom/lib/query'),
    domAttr = require('min-dom/lib/attr'),
    domClear = require('min-dom/lib/clear'),
    domClasses = require('min-dom/lib/classes'),
    domMatches = require('min-dom/lib/matches'),
    domDelegate = require('min-dom/lib/delegate'),
    domEvent = require('min-dom/lib/event');


var TOGGLE_SELECTOR = '.djs-palette-toggle',
    ENTRY_SELECTOR = '.entry',
    ELEMENT_SELECTOR = TOGGLE_SELECTOR + ', ' + ENTRY_SELECTOR;

var PALETTE_VISIBLE_CLS = 'djsp-visible',
    PALETTE_OPEN_CLS = 'djsp-open',
    PALETTE_TWO_COLUMN_CLS = 'djsp-two-column';

/**
 * A palette containing modeling elements.
 */
function Palette(eventBus, canvas) {

  this._eventBus = eventBus;
  this._canvas = canvas;

  this._providers = [];

  var self = this;

  eventBus.on('tool-manager.update', function(event) {
    var tool = event.tool;

    self.updateToolHighlight(tool);
  });

  eventBus.on('i18n.changed', function() {
    self._update();
  });
}

Palette.$inject = [ 'eventBus', 'canvas' ];

module.exports = Palette;


/**
 * Register a provider with the palette
 *
 * @param  {PaletteProvider} provider
 */
Palette.prototype.registerProvider = function(provider) {
  this._providers.push(provider);

  if (!this._container) {
    this._init();
  }

  this._update();
};


/**
 * Returns the palette entries for a given element
 *
 * @return {Array<PaletteEntryDescriptor>} list of entries
 */
Palette.prototype.getEntries = function() {

  var entries = {};

  // loop through all providers and their entries.
  // group entries by id so that overriding an entry is possible
  forEach(this._providers, function(provider) {
    var e = provider.getPaletteEntries();

    forEach(e, function(entry, id) {
      entries[id] = entry;
    });
  });

  return entries;
};


/**
 * Initialize
 */
Palette.prototype._init = function() {
  var canvas = this._canvas,
      eventBus = this._eventBus;

  var parent = canvas.getContainer(),
      container = this._container = domify(Palette.HTML_MARKUP),
      self = this;

  domClasses(parent).add(PALETTE_VISIBLE_CLS);

  parent.appendChild(container);

  domDelegate.bind(container, ELEMENT_SELECTOR, 'click', function(event) {

    var target = event.delegateTarget;

    if (domMatches(target, TOGGLE_SELECTOR)) {
      return self.toggle();
    }

    self.trigger('click', event);
  });

  // prevent drag propagation
  domEvent.bind(container, 'mousedown', function(event) {
    event.stopPropagation();
  });

  // prevent drag propagation
  domDelegate.bind(container, ENTRY_SELECTOR, 'dragstart', function(event) {
    self.trigger('dragstart', event);
  });

  eventBus.on('canvas.resized', this._layoutChanged, this);

  eventBus.fire('palette.create', {
    html: container
  });
};


Palette.prototype._update = function() {

  var entriesContainer = domQuery('.djs-palette-entries', this._container),
      entries = this._entries = this.getEntries();

  domClear(entriesContainer);

  forEach(entries, function(entry, id) {

    var grouping = entry.group || 'default';

    var container = domQuery('[data-group=' + grouping + ']', entriesContainer);
    if (!container) {
      container = domify('<div class="group" data-group="' + grouping + '"></div>');
      entriesContainer.appendChild(container);
    }

    var html = entry.html || (
      entry.separator ?
        '<hr class="separator" />' :
        '<div class="entry" draggable="true"></div>');


    var control = domify(html);
    container.appendChild(control);

    if (!entry.separator) {
      domAttr(control, 'data-action', id);

      if (entry.title) {
        domAttr(control, 'title', entry.title);
      }

      if (entry.className) {
        addClasses(control, entry.className);
      }

      if (entry.imageUrl) {
        control.appendChild(domify('<img src="' + entry.imageUrl + '">'));
      }
    }
  });

  // open after update
  this.open();
};


/**
 * Trigger an action available on the palette
 *
 * @param  {String} action
 * @param  {Event} event
 */
Palette.prototype.trigger = function(action, event, autoActivate) {
  var entries = this._entries,
      entry,
      handler,
      originalEvent,
      button = event.delegateTarget || event.target;

  if (!button) {
    return event.preventDefault();
  }

  entry = entries[domAttr(button, 'data-action')];

  // when user clicks on the palette and not on an action
  if (!entry) {
    return;
  }

  handler = entry.action;

  originalEvent = event.originalEvent || event;

  // simple action (via callback function)
  if (isFunction(handler)) {
    if (action === 'click') {
      handler(originalEvent, autoActivate);
    }
  } else {
    if (handler[action]) {
      handler[action](originalEvent, autoActivate);
    }
  }

  // silence other actions
  event.preventDefault();
};

/**
 * Trigger a layout update.
 */
Palette.prototype._layoutChanged = function() {

  var parent = this._getParentContainer();

  var twoColumn = this._needsCollapse(parent.clientHeight, this._entries || {});

  domClasses(parent)[twoColumn ? 'add' : 'remove'](PALETTE_TWO_COLUMN_CLS);
};

/**
 * Do we need to collapse to two columns?
 *
 * @param {Number} availableHeight
 * @param {Object} entries
 *
 * @return {Boolean}
 */
Palette.prototype._needsCollapse = function(availableHeight, entries) {

  // top margin + bottom toggle + bottom margin
  // implementors must override this method if they
  // change the palette styles
  var margin = 20 + 10 + 20;

  var entriesHeight = Object.keys(entries).length * 46;

  return availableHeight < entriesHeight + margin;
};

/**
 * Close the palette
 */
Palette.prototype.close = function() {

  var parent = this._getParentContainer();

  domClasses(parent)
    .remove(PALETTE_OPEN_CLS)
    .remove(PALETTE_TWO_COLUMN_CLS);
};


/**
 * Open the palette
 */
Palette.prototype.open = function() {

  var parent = this._getParentContainer();

  domClasses(parent).add(PALETTE_OPEN_CLS);

  this._layoutChanged();
};


Palette.prototype.toggle = function(open) {
  if (this.isOpen()) {
    this.close();
  } else {
    this.open();
  }
};

Palette.prototype.isActiveTool = function(tool) {
  return tool && this._activeTool === tool;
};

Palette.prototype.updateToolHighlight = function(name) {
  var entriesContainer,
      toolsContainer;

  if (!this._toolsContainer) {
    entriesContainer = domQuery('.djs-palette-entries', this._container);

    this._toolsContainer = domQuery('[data-group=tools]', entriesContainer);
  }

  toolsContainer = this._toolsContainer;

  forEach(toolsContainer.children, function(tool) {
    var actionName = tool.getAttribute('data-action');

    if (!actionName) {
      return;
    }

    actionName = actionName.replace('-tool', '');

    if (tool.classList.contains('entry') && actionName === name) {
      domClasses(tool).add('highlighted-entry');
    } else {
      domClasses(tool).remove('highlighted-entry');
    }
  });
};


/**
 * Return true if the palette is opened.
 *
 * @example
 *
 * palette.open();
 *
 * if (palette.isOpen()) {
 *   // yes, we are open
 * }
 *
 * @return {boolean} true if palette is opened
 */
Palette.prototype.isOpen = function() {
  var parent = this._getParentContainer();

  return parent && domClasses(parent).has(PALETTE_OPEN_CLS);
};

/**
 * Get container the palette lives in.
 *
 * @return {Element}
 */
Palette.prototype._getParentContainer = function() {
  return this._canvas.getContainer();
};


/* markup definition */

Palette.HTML_MARKUP =
  '<div class="djs-palette">' +
    '<div class="djs-palette-entries"></div>' +
    '<div class="djs-palette-toggle"></div>' +
  '</div>';


////////// helpers /////////////////////////////

function addClasses(element, classNames) {

  var classes = domClasses(element);

  var actualClassNames = isArray(classNames) ? classNames : classNames.split(/\s+/g);
  actualClassNames.forEach(function(cls) {
    classes.add(cls);
  });
}
