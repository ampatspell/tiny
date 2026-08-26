<script lang="ts">
  import TablerPhoto from '$lib/tiny/icons/tabler--photo.svelte';
  import { aan } from '../utils/string.ts';
  import Overlay from './overlay.svelte';

  let { type }: { type: string } = $props();
</script>

<Overlay icon={TablerPhoto} label="Select {aan(type)} {type}" />
