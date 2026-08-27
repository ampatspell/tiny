<script lang="ts">
  import '@fontsource/ubuntu-mono/400.css';
  import '@fontsource/ubuntu-mono/700.css';
  import './reset.scss';
  import './style.scss';

  let { children } = $props();
</script>

{@render children()}
