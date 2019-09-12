import { helper } from '@ember/component/helper';

export default helper(function neq([ a, b ]) {
  return a !== b;
});
