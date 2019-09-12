import { initialize } from 'ember-cli-zuglet/initialize';
import Store from '../store';

export default {
  name: 'editor:store',
  initialize: initialize({
    store: {
      identifier: 'store',
      factory: Store
    },
    development: {
      logging: false
    }
  })
};
