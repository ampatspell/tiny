const CORS = require('cors');
const cors = CORS({ origin: true });

class HttpsService {

  constructor(app) {
    this.app = app;
  }

  onError(err) {
    this.app.info(err.stack || err);
  }

  json(handler) {
    return (req, res) => {
      cors(req, res, () => {
        Promise.resolve().then(() => {
          return handler(req, res);
        }).then(json => {
          res.json(json || {});
        }, err => {
          this.onError(err);
          const status = err.status || 500;
          res.status(status);
          res.json({
            error: err.message,
            reason: err.reason,
            stack: err.stack
          });
        });
      });
    }
  }

}

module.exports = app => new HttpsService(app);
