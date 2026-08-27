<script lang="ts">
  import Form from '$lib/playground/auth/form.svelte';
  import { useSignUp } from '$lib/playground/auth/auth.svelte.js';

  let model = useSignUp();
</script>

<Form {model} title="Sign up" />
