import { helper } from '@ember/component/helper';

export default helper(function pluralize([ count, single, multiple ]) {
  return count === 1 ? single : multiple;
});
