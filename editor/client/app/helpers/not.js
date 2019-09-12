import { helper } from '@ember/component/helper';

export default helper(function eq([ value ]) {
  return !value;
});
