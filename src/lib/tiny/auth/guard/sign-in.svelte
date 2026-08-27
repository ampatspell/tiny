<script lang="ts">
  import SignIn from './forms/sign-in.svelte';
  import SignUp from './forms/sign-up.svelte';

  let form = $state<'sign-in' | 'sign-up'>('sign-in');

  let onSignUp = () => {
    form = 'sign-up';
  };

  let onSignIn = () => {
    form = 'sign-in';
  };
</script>

{#if form === 'sign-in'}
  <SignIn {onSignUp} />
{:else if form === 'sign-up'}
  <SignUp {onSignIn} />
{/if}
