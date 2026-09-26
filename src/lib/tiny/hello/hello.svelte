<script lang="ts">
  import './root.scss';
  import type { Snippet } from 'svelte';
  import Guard from '../auth/guard/guard.svelte';
  import { useTiny } from './tiny.svelte.ts';

  let { children }: { children: Snippet } = $props();

  let tiny = useTiny();
  let validate = $derived(tiny.validate);
</script>

<svelte:head>
  <link rel="preload" href="https://fonts.googleapis.com" />
  <link rel="preload" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap" rel="stylesheet" />
</svelte:head>

<Guard {validate}>
  {@render children()}
</Guard>
