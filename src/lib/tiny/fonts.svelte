<script lang="ts">
  import type { GoogleFonts } from 'google-fonts-helper';
  import { constructURL } from 'google-fonts-helper';

  let { fonts }: { fonts: GoogleFonts } = $props();

  let url = $derived(constructURL(fonts));
</script>

<svelte:head>
  {#if url}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href={url} rel="preload" as="style" />
    <link href={url} rel="stylesheet" />
  {/if}
</svelte:head>
