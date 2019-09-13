let path = require('path');
let fetch = require('./lib/fetch');
let runtime = require('./lib/runtime');

runtime(async () => {

  let opts = {
    target: path.join(__dirname, '..', 'lib', 'generated'),
    url: 'https://europe-west2-dev-tiny.cloudfunctions.net/export-world',
    token: 'Ny7qX8WIN5zW05mpPwqqWk43'
  };

  let json = await fetch(opts.url, opts.token);

  console.log(json);

});
