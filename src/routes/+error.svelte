<script lang="ts">
  import { page } from '$app/state';
  import Placeholder from '$lib/components/placeholder.svelte';
  import TablerBalloon from '$lib/playground/icons/tabler--balloon.svelte';
  import { isTruthy } from '$lib/utils/array.js';

  let status = $derived(page.status);
  let error = $derived(page.error?.message ?? 'Unknown error');
  let label = $derived.by(() => {
    return [status !== 200 && status, error].filter(isTruthy).join(' ');
  });
</script>

<Placeholder icon={TablerBalloon} {label} />
