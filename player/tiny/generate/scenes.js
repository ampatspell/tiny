module.exports = async (hash, render) => {

  let { project, world, world: { scenes } } = hash;

  await render({ template: 'scenes', props: { project, world, scenes } });

}
