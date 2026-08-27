<script lang="ts">
  import { useBroadcastChannel } from '$lib/tiny/broadcast.svelte.js';
  import Button from '$lib/tiny/button/button.svelte';
  import TablerBalloon from '$lib/tiny/icons/tabler--balloon.svelte';
  import Placeholder from '$lib/tiny/placeholder.svelte';
  import { signOut } from '../auth.svelte.ts';

  let channel = useBroadcastChannel();

  let onSignOut = async () => {
    await signOut({ channel });
  };
</script>

<Placeholder icon={TablerBalloon} label="Sorry, you don't have access to this page">
  <Button label="Sign out" onClick={onSignOut} />
</Placeholder>
