module.exports = async (hash, render) => {

  let { project, world } = hash;

  await Promise.all(world.scenes.map(async (scene, idx) => {
    scene.index = idx;
    await render({ template: 'scene', filename: `scene_${idx}`, props: { scene, world, project } });
  }));

}
