<script lang="ts">
  import './root.scss';
  import type { Snippet } from 'svelte';
  import Guard from '../auth/guard/guard.svelte';
  import { useTiny } from './tiny.svelte.ts';
  import Fonts from '../fonts.svelte';

  let { children }: { children: Snippet } = $props();

  let tiny = useTiny();
  let validate = $derived(tiny.validate);
</script>

<Fonts
  fonts={{
    families: {
      'Ubuntu Mono': { wght: [400, 700] },
    },
    display: 'swap',
  }}
/>

<Guard {validate}>
  {@render children()}
</Guard>
