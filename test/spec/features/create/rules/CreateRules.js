'use strict';

import inherits from 'inherits';

import RuleProvider from '../../../../../lib/features/rules/RuleProvider';

export default function CreateRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

CreateRules.$inject = [ 'eventBus' ];

inherits(CreateRules, RuleProvider);


CreateRules.prototype.init = function() {
  this.addRule('shape.create', function(context) {

    var target = context.target;

    if (/child/.test(target.id)) {
      return 'attach';
    }

    if (/parent/.test(target.id) || context.source) {
      return true;
    }

    return false;
  });
};
