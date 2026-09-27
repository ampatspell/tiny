<script lang="ts">
  import { page } from '$app/state';
  import { tick, type Snippet } from 'svelte';
  import { getToken } from '../auth.remote.ts';
  import Denied from './denied.svelte';
  import SignIn from './sign-in.svelte';
  import type { ValidateFunction } from './validate.svelte.ts';
  import Tiny from '#lib/tiny/tiny.svelte';

  let { children, validate }: { children: Snippet; validate?: ValidateFunction } = $props();

  let res = $derived(await getToken());

  let refresh = async () => {
    await tick();
    getToken().refresh();
  };

  let resolution = $derived.by(() => {
    if (validate) {
      if (res.status === 'success') {
        let token = res.token;
        let url = page.url;
        return validate({ url, token });
      } else if (res.status === 'anonymous') {
        return 'sign-in';
      } else if (res.status == 'needs-refresh') {
        refresh();
      }
      return 'denied';
    } else {
      return 'allowed';
    }
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
