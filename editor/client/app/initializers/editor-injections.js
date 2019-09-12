export default {
  name: 'editor:injections',
  initialize(app) {
    app.inject('model', 'router', 'service:router');
    app.inject('component', 'router', 'service:router');
  }
};
