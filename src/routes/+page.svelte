<script lang="ts">
  import { resolve } from '$app/paths';
  import TablerBalloon from '$lib/tiny/icons/tabler--balloon.svelte';
  import Index from '$lib/playground/index/index.svelte';
  import Dark from '$lib/tiny/dark.svelte';
  import Screen from '$lib/tiny/screen.svelte';
  import Icon from '$lib/tiny/icon.svelte';
</script>

<Dark>
  <div class="page">
    <Screen>
      <Index />
    </Screen>
  </div>
  <a href={resolve('/_admin')} class="edit">
    <Icon icon={TablerBalloon} />
  </a>
</Dark>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .edit {
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
</style>
