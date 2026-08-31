<script lang="ts">
  import AuthForm from './form.svelte';
  import { useSignIn } from './model.svelte.ts';

  let { onSignUp }: { onSignUp: () => void } = $props();

  let model = useSignIn();

  let secondary = {
    label: "Don't have an account yet?",
    onClick: () => onSignUp(),
  };
</script>

<AuthForm {model} title="Sign in" {secondary} />
