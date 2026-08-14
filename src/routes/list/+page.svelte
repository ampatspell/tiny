<script lang="ts">
  import Header from '$lib/components/backend/header/header.svelte';
  import Title from '$lib/components/backend/header/title.svelte';
  import List from '$lib/components/backend/list/list.svelte';
</script>

<div class="page">
  <Header>
    {#snippet left()}
      <Title label="Basic list" />
    {/snippet}
  </Header>
  <div class="content">
    <div class="list">
      <List />
    </div>
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .content {
      flex: 1;
      display: flex;
      flex-direction: row;
      > .list {
        width: 320px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--dark-border-color-1);
      }
    }
  }
</style>
