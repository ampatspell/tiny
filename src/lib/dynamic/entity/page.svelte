<script lang="ts">
  import { useEntityContext } from './layout.svelte';
  import PageMany from './page-many.svelte';
  import PageOne from './page-one.svelte';

  let context = useEntityContext();
  let entity = $derived(context.entity);
</script>

{#if entity}
  {#if entity.type === 'one'}
    <PageOne {entity} />
  {:else if entity.type === 'many'}
    <PageMany {entity} />
  {/if}
{/if}
