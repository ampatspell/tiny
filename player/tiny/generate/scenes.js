module.exports = async (hash, render) => {

  let { title, world, world: { scenes } } = hash;

  await render({ template: 'scenes', props: { project: { title }, world, scenes } });

}
