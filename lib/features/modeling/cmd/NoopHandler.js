'use strict';

/**
 * A command handler that does nothing.
 */
export default function NoopHandler() {}

/**
 * Execute command.
 *
 * @return {Array<Element>|Element} changed elements
 */
NoopHandler.prototype.execute = function() {};

/**
 * Revert executed command.
 *
 * @return {Array<Element>|Element} changed elements
 */
NoopHandler.prototype.revert = function() {};