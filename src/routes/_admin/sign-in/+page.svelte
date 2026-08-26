<script lang="ts">
  import Auth from '$lib/playground/auth/auth.svelte';
  import { useSignIn } from '$lib/playground/auth/auth.svelte.js';

  let model = useSignIn();
</script>

<Auth {model} title="Sign in" />
