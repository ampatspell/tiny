let fetch = require('node-fetch');

module.exports = async (url, token) => {
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  });
  let json = await response.json();
  return json;
}
