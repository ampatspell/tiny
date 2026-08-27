<script lang="ts">
  import '@fontsource/ubuntu-mono/400.css';
  import '@fontsource/ubuntu-mono/700.css';
  import mono400 from '@fontsource/ubuntu-mono/400.css?url';
  import mono700 from '@fontsource/ubuntu-mono/700.css?url';
  import './reset.scss';
  import './style.scss';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="preload" as="font" type="font/woff2" href={mono400} crossorigin="anonymous" />
  <link rel="preload" as="font" type="font/woff2" href={mono700} crossorigin="anonymous" />
</svelte:head>

{@render children()}
