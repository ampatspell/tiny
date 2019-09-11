import { helper } from '@ember/component/helper';
import { guidFor as _guidFor } from '@ember/object/internals';

export default helper(function guidFor([ model ]) {
  return _guidFor(model);
});
