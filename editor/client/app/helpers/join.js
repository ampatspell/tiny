import { helper } from '@ember/component/helper';
import { A } from '@ember/array';

export default helper(function join(params, { delimiter }) {
  return A(params).compact().join(delimiter || "");
});
