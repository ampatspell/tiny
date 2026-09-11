<script lang="ts">
  import Index from '#lib/playground/index/index.svelte';
  import Icon from '#lib/tiny/icon.svelte';
  import TablerBalloon from '#lib/tiny/icons/tabler--balloon.svelte';
  import Tiny from '#lib/tiny/tiny.svelte';
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Welcome to Tiny</title>
</svelte:head>

<Tiny>
  <div class="page">
    <Index />
  </div>
  <a href={resolve('/(tiny)/_admin/(nav)')} class="edit">
    <Icon icon={TablerBalloon} />
    <div class="label">open backend (admin/admin)</div>
  </a>
</Tiny>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .edit {
    position: absolute;
    bottom: 20px;
    left: 20px;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    background: #fff;
    padding: 5px 8px;
    font-size: 12px;
    border-radius: 3px;
  }
</style>
