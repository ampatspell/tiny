<script lang="ts">
  import { useEntityContext } from '../layout.svelte';
  import PageMany from './page-many.svelte';
  import PageOne from './page-one.svelte';

  let {
    id,
  }: {
    id: string | undefined;
  } = $props();

  let context = useEntityContext();
  let entity = $derived(context.entity);
</script>

{#if entity && id}
  {#if entity.type === 'one'}
    <PageOne {entity} {id} />
  {:else if entity.type === 'many'}
    <PageMany {entity} {id} />
  {/if}
{/if}
