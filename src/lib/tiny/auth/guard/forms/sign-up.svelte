<script lang="ts">
  import Form from './form.svelte';
  import { useSignUp } from './model.svelte.ts';

  let { onSignIn }: { onSignIn: () => void } = $props();

  let model = useSignUp();

  let secondary = {
    label: '← Back',
    onClick: () => onSignIn(),
  };
</script>

<Form {model} title="Sign up" {secondary} />
