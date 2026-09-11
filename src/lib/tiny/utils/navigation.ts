import { beforeNavigate, goto, type BeforeNavigate } from '$app/navigation';
import { useFloaters } from '../floating/floaters/model.svelte.ts';
import { confirm } from '../floating/layout/confirmation.svelte';
import { options, type OptionsInput } from './options.svelte.ts';

export const useNavigationConfirmation = (
  _opts: OptionsInput<{
    isDirty: boolean;
    isDestroyed: boolean;
  }>,
) => {
  const opts = options(_opts);
  const floaters = useFloaters();

  let confirmed = false;

  const confirmNavigation = async (navigation: BeforeNavigate) => {
    confirmed = await confirm({
      type: 'center',
      floaters,
      title: 'Do you want to discard the changes you made?',
      confirm: 'Discard',
    });

    if (confirmed && navigation.to) {
      try {
        await goto(navigation.to.url);
      } finally {
        confirmed = false;
      }
    }
  };

  beforeNavigate((navigation) => {
    const isDirty = opts.isDirty && !opts.isDestroyed;
    const isForm = navigation.type === 'form';
    const isSame = navigation.from?.url.toString() === navigation.to?.url.toString();
    if (!confirmed && isDirty && !isForm && !isSame) {
      navigation.cancel();
      confirmNavigation(navigation);
    }
  });
};
