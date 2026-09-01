<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getToken } from '../auth.remote.ts';
  import { page } from '$app/state';
  import Tiny from '#lib/tiny/tiny.svelte';
  import SignIn from './sign-in.svelte';
  import type { ValidateFunction } from './validate.svelte.ts';
  import Denied from './denied.svelte';

  let { children, validate }: { children: Snippet; validate?: ValidateFunction } = $props();

  let token = $derived(await getToken());

  let resolution = $derived.by(() => {
    if (validate) {
      let url = page.url;
      return validate({ url, token });
    }
    return 'allowed';
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
