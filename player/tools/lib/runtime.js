module.exports = fn => {
  Promise.resolve()
    .then(() => fn())
    .then(() => {
      process.exit(0);
    }, err => {
      console.log(err.stack);
      process.exit(-1);
    });
}
