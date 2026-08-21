<script lang="ts">
  import { page } from '$app/state';
  import Layout from '$lib/dynamic/entity/layout.svelte';

  let { children } = $props();

  let id = $derived(page.params.entity);
</script>

<Layout {id}>
  {@render children()}
</Layout>
