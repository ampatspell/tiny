<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import Icon from '#lib/tiny/button/icon.svelte';
  import Tooltip from '#lib/tiny/floating/tooltip.svelte';
  import TablerSun from '#lib/tiny/icons/tabler--sun.svelte';
  import type { ResolvedPathname } from '$app/types';

  let {
    route,
  }: {
    route: ResolvedPathname | undefined | null;
  } = $props();

  let label = $derived.by(() => {
    if (route) {
      return `Go to ${route}`;
    }
  });
</script>

{#if route !== undefined}
  <Tooltip {label} placement="right">
    <Button type="link" variant="light" route={route ?? undefined} isDisabled={!route}>
      <Icon icon={TablerSun} />
    </Button>
  </Tooltip>
{/if}
