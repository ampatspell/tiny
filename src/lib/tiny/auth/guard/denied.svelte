<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import Button from '$lib/tiny/button/button.svelte';
  import TablerBalloon from '$lib/tiny/icons/tabler--balloon.svelte';
  import Placeholder from '$lib/tiny/placeholder.svelte';
  import { signOut } from '../auth.remote.ts';

  let onSignOut = async () => {
    await goto(resolve('/'));
    await signOut();
  };
</script>

<Placeholder icon={TablerBalloon} label="Sorry, you don't have access to this page">
  <Button label="Sign out" onClick={onSignOut} />
</Placeholder>
