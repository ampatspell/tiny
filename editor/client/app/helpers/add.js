import { helper } from '@ember/component/helper';

export default helper(function add(params/*, hash*/) {
  return params.reduce((total, value) => {
    total += value;
    return total;
  }, 0);
});
