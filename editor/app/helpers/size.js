import { helper } from '@ember/component/helper';

export default helper(function size([ size, suffix ]) {
  if(!size) {
    return;
  }

  let { width, height } = size;

  let string = `${width}×${height}`;

  if(suffix) {
    string = `${string}${suffix}`;
  }

  return string;
});
