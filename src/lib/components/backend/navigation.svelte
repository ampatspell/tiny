<script lang="ts">
  import Icon from '../icon.svelte';
  import { useBackend } from './backend.svelte.ts';
  import Tooltip from '../floating/tooltip.svelte';

  let backend = useBackend();
</script>

<div class="navigation">
  <div class="items">
    {#each backend.sections as section (section.icon)}
      <a class={['item', section.isCurrent && 'current']} href={section.route}>
        <Tooltip label={section.name} offset={14} placement="right">
          <Icon icon={section.icon} />
        </Tooltip>
      </a>
    {/each}
  </div>
</div>

<style lang="scss">
  .navigation {
    flex: 1;
    width: min-content;
    background: #333;
    color: #fff;
    display: flex;
    flex-direction: column;
    > .items {
      display: flex;
      flex-direction: column;
      > .item {
        display: flex;
        flex-direction: row;
        padding: 10px;
        gap: 5px;
        align-items: center;
        font-size: var(--dark-font-size-small);
        text-decoration: none;
        &:hover {
          background: #222;
        }
        &.current {
          background: #111;
        }
      }
    }
  }
</style>
