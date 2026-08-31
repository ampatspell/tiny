<script lang="ts">
  import { useBackend } from '#lib/tiny/backend/context.svelte.js';
  import TinyPlaceholder from '#lib/tiny/placeholder.svelte';

  let backend = useBackend();
  let item = $derived(backend.item);
  let icon = $derived(item.icon);
  let label = $derived(item.name);
</script>

<TinyPlaceholder {icon} {label} />
