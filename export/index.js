let fetch = require('node-fetch');

const load = async (url, token) => {
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
  let json = await load(url, 'hello-world');
  console.log(json);
}

run().then(() => {
  console.log('done');
}, err => {
  console.log(err.stack);
});
