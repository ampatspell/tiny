<script lang="ts" generics=" P extends Model">
  import Button from '#lib/tiny/button/button.svelte';
  import Icon from '#lib/tiny/button/icon.svelte';
  import Tooltip from '#lib/tiny/floating/tooltip.svelte';
  import TablerSun from '#lib/tiny/icons/tabler--sun.svelte';
  import type { EditingLayout, Model } from '../layout.svelte.ts';

  let {
    layout,
  }: {
    layout: EditingLayout<P>;
  } = $props();

  let route = $derived(layout.frontend);
  let label = $derived.by(() => {
    if (route) {
      return `Go to ${route}`;
    }
  });
</script>

{#if route !== null}
  <Tooltip {label} placement="right">
    <Button type="link" variant="light" {route} isDisabled={!route}>
      <Icon icon={TablerSun} />
    </Button>
  </Tooltip>
{/if}
