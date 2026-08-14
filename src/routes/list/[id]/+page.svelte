<script lang="ts">
  import { page } from '$app/state';
  import Header from '$lib/components/backend/header/header.svelte';
  import Title from '$lib/components/backend/header/title.svelte';

  let id = $derived(page.params.id ?? 'nothing');
</script>

<div class="page">
  <Header>
    <Title label={id} />
  </Header>
  <div class="content"></div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
