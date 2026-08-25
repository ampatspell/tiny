<script lang="ts">
  import { page } from '$app/state';
  import Dark from '$lib/tiny/dark.svelte';
  import TablerBalloon from '$lib/tiny/icons/tabler--balloon.svelte';
  import Placeholder from '$lib/tiny/placeholder.svelte';
  import { isTruthy } from '$lib/tiny/utils/array.js';

  let status = $derived(page.status);
  let error = $derived(page.error?.message ?? 'Unknown error');
  let label = $derived.by(() => {
    return [status !== 200 && status, error].filter(isTruthy).join(' ');
  });
</script>

<Dark>
  <Placeholder icon={TablerBalloon} {label} />
</Dark>
