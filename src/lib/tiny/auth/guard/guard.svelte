<script lang="ts">
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';
  import { getToken } from '../auth.remote.ts';
  import Denied from './denied.svelte';
  import SignIn from './sign-in.svelte';
  import type { ValidateFunction } from './validate.svelte.ts';
  import Tiny from '#lib/tiny/tiny.svelte';

  let { children, validate }: { children: Snippet; validate?: ValidateFunction } = $props();

  let response = $derived(await getToken());

  let resolution = $derived.by(() => {
    if (!validate) {
      return 'allowed';
    }
    if (response.status === 'success') {
      let token = response.token;
      let url = page.url;
      return validate({ url, token });
    } else if (response.status === 'anonymous') {
      return 'sign-in';
    } else if (response.status == 'needs-refresh') {
      getToken().refresh();
    }
    return 'denied';
  });
</script>

{#if resolution === 'allowed'}
  {@render children()}
{:else if resolution === 'sign-in'}
  <Tiny>
    <SignIn />
  </Tiny>
{:else if resolution === 'denied'}
  <Tiny>
    <Denied />
  </Tiny>
{/if}
