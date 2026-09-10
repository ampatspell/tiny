<script lang="ts">
  import { getGalleryByPermalink } from '#lib/playground/galleries/galleries.remote.js';
  import Json from '#lib/tiny/json.svelte';
  import { page } from '$app/state';

  let gallery = $derived(await getGalleryByPermalink({ permalink: page.params.permalink! }));
</script>

<Json data={gallery} />
