<script lang="ts">
  import { resolve } from '$app/paths';
  import Dark from '$lib/components/dark.svelte';
  import Icon from '$lib/components/icon.svelte';
  import Screen from '$lib/components/screen.svelte';
  import TablerBalloon from '$lib/playground/icons/tabler--balloon.svelte';
  import Index from '$lib/playground/index/index.svelte';
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
