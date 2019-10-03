export const split = (props, keys) => {
  let local = {};
  let remote = {};
  if(props) {
    Object.keys(props).forEach(key => {
      let value = props[key];
      if(value !== undefined) {
        if(keys.includes(key)) {
          local[key] = value;
        } else {
          remote[key] = value;
        }
      }
    });
  }
  return [ local, remote ];
};
