module.exports = async (hash, render) => {

  let { project, sprites } = hash;

  await render('sprites', { sprites, project });

}
