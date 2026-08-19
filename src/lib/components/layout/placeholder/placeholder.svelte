<script lang="ts">
  import { useBackend } from '$lib/components/backend/backend.svelte.js';
  import Placeholder from '$lib/components/placeholder.svelte';

  let backend = useBackend();
  let section = $derived(backend.section);
  let icon = $derived(section.icon);
  let label = $derived(section.name);
</script>

<Placeholder {icon} {label} />
