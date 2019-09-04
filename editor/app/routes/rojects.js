import Route from '@ember/routing/route';
import RequirementsMixin from './-requirements';

export default Route.extend(RequirementsMixin, {

  require: 'authenticated'

});
