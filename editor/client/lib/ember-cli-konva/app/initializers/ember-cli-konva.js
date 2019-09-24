import Definition from 'ember-cli-konva/-private/definition/definition';
import DefinitionNode from 'ember-cli-konva/-private/definition/node';

export default {
  name: 'ember-cli-konva:main',
  initialize(container) {
    container.register('konva:definition', Definition);
    container.register('konva:definition/node', DefinitionNode);
  }
};
