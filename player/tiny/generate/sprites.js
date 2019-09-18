module.exports = async (hash, render) => {

  let { title, sprites } = hash;

  await render({ template: 'sprites', props: { sprites, project: { title } } });

}
