import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';

export default Component.extend({
  classNameBindings: [ ':ui-route-projects-project-worlds-world-index' ],

  world: readOnly('model.world'),
  state: model().owner('world').named('state/world').mapping(({ world }) => ({ world }))

});
