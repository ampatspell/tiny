<script lang="ts">
  import Item from '../../backend/navigation/item.svelte';
  import { useFloaters } from '$lib/tiny/floating/floaters.svelte.js';
  import { getToken } from '$lib/tiny/auth/auth.remote.js';
  import { basic } from '$lib/tiny/floating/position.js';
  import Card from './card.svelte';
  import type { TokenPayload } from '$lib/tiny/server/users/users.js';
  import TablerUser from '$lib/tiny/icons/tabler--user.svelte';

  let floaters = useFloaters();
  let token = $derived(await getToken());
  let item = $state<Item>();

  let onClick = async () => {
    const reference = item?.element;
    if (reference && token) {
      floaters.open({
        reference: () => reference,
        position: basic({
          placement: 'right-end',
          offset: { mainAxis: 5 },
        }),
        snippet,
        request: { token },
        close: null,
      });
    }
  };
</script>

{#if token}
  <Item bind:this={item} icon={TablerUser} {onClick} />
{/if}

{#snippet snippet({ request: { token } }: { request: { token: TokenPayload } })}
  <Card {token} />
{/snippet}
