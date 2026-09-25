<script lang="ts">
  import Pill from './pill.svelte';

  let {
    deg,
    label,
  }: {
    deg?: number;
    label?: string;
  } = $props();
</script>

<Pill {deg} {label} />
