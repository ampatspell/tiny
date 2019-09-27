import setGlobal from '../utils/set-global';

export default {
  name: 'editor:dev',
  after: 'editor:store',
  initialize: app => { // eslint-disable-line no-unused-vars
    window.setGlobal = setGlobal;
  }
};
