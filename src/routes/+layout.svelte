<script lang="ts">
  import '../lib/reset.scss';
  import '../lib/style.scss';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <title>box</title>
</svelte:head>

{@render children()}
