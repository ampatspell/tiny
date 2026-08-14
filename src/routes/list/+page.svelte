<script lang="ts">
  import Header from '$lib/components/backend/header/header.svelte';
  import Title from '$lib/components/backend/header/title.svelte';
  import List from '$lib/components/backend/list/list.svelte';
</script>

<div class="page">
  <div class="sidebar">
    <List>
      {#snippet top()}
        <Header>
          <Title label="Basic list" />
        </Header>
      {/snippet}
    </List>
  </div>
  <div class="detail">
    <Header>
      <Title label="Nothing selected" />
    </Header>
    <div class="content"></div>
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: row;
    > .sidebar {
      width: 320px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--dark-border-color-1);
    }
    > .detail {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
