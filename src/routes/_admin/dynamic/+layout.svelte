<script lang="ts">
  import { setDynamic } from '$lib/dynamic/dynamic.svelte.js';
  import { galleries } from '$lib/playground/galleries.svelte';
  import Layout from '$lib/dynamic/layout.svelte';
  import { index } from '$lib/playground/index.svelte';

  let { children } = $props();

  setDynamic({
    entities: [index, galleries],
  });
</script>

<Layout>
  {@render children()}
</Layout>
