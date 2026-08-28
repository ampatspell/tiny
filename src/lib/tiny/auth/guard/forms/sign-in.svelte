<script lang="ts">
  import Form from './form.svelte';
  import { useSignIn } from './model.svelte.ts';

  let { onSignUp }: { onSignUp: () => void } = $props();

  let model = useSignIn();

  let secondary = {
    label: "Don't have an account yet?",
    onClick: () => onSignUp(),
  };
</script>

<Form {model} title="Sign in" {secondary} />
