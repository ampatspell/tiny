<script lang="ts">
  import Header from '$lib/components/header/header.svelte';
  import Title from '$lib/components/header/title.svelte';
  import type { Snippet } from 'svelte';
  import Discard from './discard.svelte';
  import Save from './save.svelte';
  import Delete from './delete.svelte';
  import { useFloaters } from '$lib/components/floating/floaters.svelte.js';
  import { confirm } from '$lib/components/floating/layout/confirmation.svelte';

  let {
    label,
    properties,
    onDelete,
    children,
  }: {
    label: string;
    properties: {
      isDirty: boolean;
      save: () => Promise<void>;
      rollback: () => void;
    };
    onDelete: (reference: HTMLElement) => Promise<void>;
    children: Snippet;
  } = $props();

  let floaters = useFloaters();

  let onSave = () => properties.save();
  let onDiscard = async (reference: HTMLElement) => {
    if (
      await confirm({
        floaters,
        reference,
        title: 'Discard?',
        description: 'Sure you want discard all your changes?',
        confirm: 'Discard',
      })
    ) {
      properties.rollback();
    }
  };
</script>

<div class="editing">
  <Header>
    <Title {label} />
    {#snippet accessories()}
      {#if properties.isDirty}
        <Save {onSave} />
        <Discard {onDiscard} />
      {/if}
      <Delete {onDelete} />
    {/snippet}
  </Header>
  <div class="content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .editing {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
