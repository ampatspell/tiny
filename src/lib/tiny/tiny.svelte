<script lang="ts">
  import '@fontsource/ubuntu-mono/400.css';
  import '@fontsource/ubuntu-mono/700.css';
  import './reset.scss';
  import './style.scss';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

{@render children?.()}
