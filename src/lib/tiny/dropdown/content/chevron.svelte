<script lang="ts">
  import TablerChevronDown from '#lib/tiny/icons/tabler--chevron-down.svelte';
  import TablerChevronUp from '#lib/tiny/icons/tabler--chevron-up.svelte';
  import Icon from './icon.svelte';

  let { isOpen }: { isOpen: boolean } = $props();
</script>

<Icon icon={isOpen ? TablerChevronUp : TablerChevronDown} />
