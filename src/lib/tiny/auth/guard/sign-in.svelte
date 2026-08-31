<script lang="ts">
  import SignInForm from './forms/sign-in.svelte';
  import SignUpForm from './forms/sign-up.svelte';

  let form = $state<'sign-in' | 'sign-up'>('sign-in');

  let onSignUp = () => {
    form = 'sign-up';
  };

  let onSignIn = () => {
    form = 'sign-in';
  };
</script>

{#if form === 'sign-in'}
  <SignInForm {onSignUp} />
{:else if form === 'sign-up'}
  <SignUpForm {onSignIn} />
{/if}
