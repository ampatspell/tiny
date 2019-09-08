import { helper } from '@ember/component/helper';
import { widow as _widow } from 'editor/utils/string';

export default helper(function widow([ text ]) {
  return _widow(text);
});
