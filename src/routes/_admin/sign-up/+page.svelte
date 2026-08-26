<script lang="ts">
  import Auth from '$lib/playground/auth/auth.svelte';
  import { useSignUp } from '$lib/playground/auth/auth.svelte.js';

  let model = useSignUp();
</script>

<Auth {model} title="Sign up" />
