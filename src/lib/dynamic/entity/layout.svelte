<script module lang="ts">
  export const createEntityContext = (_opts: OptionsInput<{ id: string | undefined }>) => {
    let opts = options(_opts);

    let entity = $derived(useDynamic().entityById(opts.id));

    return options({
      entity: getter(() => entity),
    });
  };

  let [useEntityContext, setEntityContext] = createContext<ReturnType<typeof createEntityContext>>();

  export { useEntityContext };
</script>

<script lang="ts">
  import { createContext, type Snippet } from 'svelte';
  import { useDynamic } from '../dynamic.svelte.ts';
  import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';
  import LayoutOne from './layout-one.svelte';
  import LayoutMany from './layout-many.svelte';

  const {
    id,
    children,
  }: {
    id: string | undefined;
    children: Snippet;
  } = $props();

  let context = setEntityContext(createEntityContext({ id: getter(() => id) }));
  let entity = $derived(context.entity);
</script>

{#if entity}
  {#if entity.type === 'one'}
    <LayoutOne {entity}>
      {@render children()}
    </LayoutOne>
  {:else if entity.type === 'many'}
    <LayoutMany {entity}>
      {@render children()}
    </LayoutMany>
  {/if}
{/if}
