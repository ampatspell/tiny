module.exports = async (hash, render) => {

  let { project, sprites } = hash;

  await render({ template: 'sprites', props: { sprites, project } });

}
