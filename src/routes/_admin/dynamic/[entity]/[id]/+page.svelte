<script lang="ts">
  import { page } from '$app/state';
  import Page from '$lib/dynamic/entity/id/page.svelte';

  let id = $derived(page.params.id);
</script>

<Page {id} />
