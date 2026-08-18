<script lang="ts">
  import Header from '$lib/components/header/header.svelte';
  import Title from '$lib/components/header/title.svelte';
  import type { Snippet } from 'svelte';
  import Delete from './button/delete.svelte';
  import { useFloaters } from '$lib/components/floating/floaters.svelte.js';
  import { confirm } from '$lib/components/floating/layout/confirmation.svelte';
  import Save from './button/save.svelte';
  import Discard from './button/discard.svelte';

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
    let ok = await confirm({
      floaters,
      reference,
      title: 'Discard?',
      description: 'Sure you want discard all your changes?',
      confirm: 'Discard',
    });
    if (ok) {
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
    <div class="overflow">
      {@render children()}
    </div>
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
      position: relative;
      > .overflow {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
