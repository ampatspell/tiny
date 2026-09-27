<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import Icon from '#lib/tiny/button/icon.svelte';
  import Tooltip from '#lib/tiny/floating/tooltip.svelte';
  import TablerSun from '#lib/tiny/icons/tabler--sun.svelte';
  import { Action, fromOptional } from '#lib/tiny/utils/action.svelte.js';
  import type { ResolvedPathname } from '$app/types';

  let {
    route: _route,
  }: {
    route: Action<ResolvedPathname | undefined> | undefined;
  } = $props();

  let route = $derived(fromOptional(_route, 'hides', 'disables'));
  let resolved = $derived(route.action);
  let isDisabled = $derived(route.isDisabled);
  let isHidden = $derived(route.isHidden);

  let label = $derived.by(() => {
    if (resolved) {
      return `Go to ${resolved}`;
    }
  });
</script>

{#if !isHidden}
  <Tooltip {label} placement="right" {isDisabled}>
    <Button type="link" variant="light" route={resolved} {isDisabled}>
      <Icon icon={TablerSun} />
    </Button>
  </Tooltip>
{/if}
