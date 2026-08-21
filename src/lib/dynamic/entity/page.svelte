<script lang="ts">
  import Placeholder from '$lib/components/placeholder.svelte';
  import { useEntityContext } from './layout.svelte';

  let context = useEntityContext();
  let entity = $derived(context.entity!);

  let icon = $derived(entity.icon);
  let label = $derived(entity.name);
</script>

<Placeholder {icon} {label} />
