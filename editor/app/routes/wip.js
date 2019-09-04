import Route from '@ember/routing/route';
import RequirementsMixin from './-requirements';

export default Route.extend(RequirementsMixin, {

  require: 'authenticated',

  async model() {
    let project = this.store.models.create('project', { id: 'N01uqaf8XakLdobq4zFZ' });
    await project.load();
    let sprite = project.sprites.sprite('lkTlgQiLXXZ0Nj18deOy');
    return sprite;
  }

});
