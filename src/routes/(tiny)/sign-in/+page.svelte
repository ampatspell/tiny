<script lang="ts">
  import Form from '$lib/playground/auth/form.svelte';
  import { useSignIn } from '$lib/playground/auth/auth.svelte.js';

  let model = useSignIn();
</script>

<Form {model} title="Sign in" />
