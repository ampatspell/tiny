import { helper } from '@ember/component/helper';

export default helper(function position([ position ]) {
  if(!position) {
    return;
  }

  let { x, y } = position;

  return `{${x},${y}}`;
});
