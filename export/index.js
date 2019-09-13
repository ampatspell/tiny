const fetch = async (url, token) => {
  let fetch = require('node-fetch');
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  });
  return await response.json();
}

const run = async () => {
  let url = 'https://europe-west2-dev-tiny.cloudfunctions.net/export-world';
  let json = await fetch(url, 'Ny7qX8WIN5zW05mpPwqqWk43');
  console.log(json);
}

run().then(() => {}, err => console.log(err.stack));
