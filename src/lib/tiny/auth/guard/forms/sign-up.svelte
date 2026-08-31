<script lang="ts">
  import AuthForm from './form.svelte';
  import { useSignUp } from './model.svelte.ts';

  let { onSignIn }: { onSignIn: () => void } = $props();

  let model = useSignUp();

  let secondary = {
    label: '← Back',
    onClick: () => onSignIn(),
  };
</script>

<AuthForm {model} title="Sign up" {secondary} />
