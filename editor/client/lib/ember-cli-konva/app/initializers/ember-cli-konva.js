import DefinitionProperty from 'ember-cli-konva/-private/definition/property';
import Definition from 'ember-cli-konva/-private/definition/definition';

export default {
  name: 'ember-cli-konva:main',
  initialize(container) {
    container.register('konva:definition/property', DefinitionProperty);
    container.register('konva:definition', Definition);
  }
};
