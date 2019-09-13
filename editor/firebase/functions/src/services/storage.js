const uuid = require('uuid/v4');

const {
  assign
} = Object;

const firebaseStorageDownloadTokens = 'firebaseStorageDownloadTokens';

const urlFor = (bucket, name, token) => {
  let encodedName = encodeURIComponent(name);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedName}?alt=media&token=${token}`;
};

class StorageService {

  constructor(app) {
    this.app = app;
    this.bucket = app.bucket;
  }

  async deleteFile(path, opts={}) {
    let { optional } = assign({ optional: false }, opts);
    try {
      await this.bucket.file(path).delete();
      return true;
    } catch(err) {
      if(optional && err.code === 404) {
        return false;
      }
      throw err;
    }
  }

  deleteFiles(paths, opts={}) {
    return Promise.all(paths.map(path => this.deleteFile(path, opts)));
  }

  async saveBuffer(buffer, path, opts) {
    let { bucket } = this;

    let token = uuid();

    await bucket.file(path).save(buffer, assign({
      resumable: false,
      metadata: {
        metadata: {
          [firebaseStorageDownloadTokens]: token
        }
      }
    }, opts));

    let url = urlFor(bucket.name, path, token);

    return {
      url,
      token
    };
  }

  async getURL(path) {
    let { bucket } = this;
    let [ metadata ] = await bucket.file(path).getMetadata();
    let token = metadata.metadata[firebaseStorageDownloadTokens];
    let url = urlFor(bucket.name, path, token);
    return {
      token,
      url
    };
  }

  async copy(source, destination) {
    let file = this.bucket.file(source);
    await file.copy(destination);
    let { url, token } = await this.getURL(destination);
    return { url, token };
  }

}

module.exports = app => new StorageService(app);
