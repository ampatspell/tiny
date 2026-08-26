<script lang="ts">
  import { useBackend } from '$lib/tiny/backend/backend.svelte.js';
  import Placeholder from '$lib/tiny/placeholder.svelte';

  let backend = useBackend();
  let section = $derived(backend.section);
  let icon = $derived(section?.icon);
  let label = $derived(section?.name);
</script>

<Placeholder {icon} {label} />
