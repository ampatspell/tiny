export default {
  name: 'editor:injections',
  initialize(app) {
    app.inject('component', 'router', 'service:router');
  }
};
