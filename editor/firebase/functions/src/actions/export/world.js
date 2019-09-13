module.exports = app => app.functions.https.onRequest(app.services.https.json(async req => {

  let json = req.body;
  if(!json) {
    throw new Error('Only application/json is accepted');
  }

  let { token } = json;
  if(!token) {
    throw new Error('Export token is required');
  }

  return { ok: true, token };

}));
