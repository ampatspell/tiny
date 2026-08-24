<script module lang="ts">
  import Input from '$lib/components/input.svelte';
  import type { Property } from '$lib/properties/property.svelte.js';
  import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';
  import { untrack } from 'svelte';

  const integerToString = (number: number | undefined) => {
    if (typeof number === 'number') {
      if (!isNaN(number) && number !== Infinity) {
        return String(number);
      }
    }
    return undefined;
  };

  const stringToInteger = (string: string) => {
    const number = parseInt(string);
    if (!isNaN(number) && number !== Infinity) {
      return number;
    }
    return undefined;
  };

  export const useNumberPropertyEditor = (_opts: OptionsInput<{ property: Property<number>; fallback?: number }>) => {
    let opts = options(_opts);
    let fallback = $derived(opts.fallback ?? 0);
    let property = $derived(opts.property);
    let value = $derived(integerToString(property.value) ?? '');
    let local = $state<string>(untrack(() => value));

    $effect(() => {
      let untracked = untrack(() => local);
      if (stringToInteger(untracked) !== undefined) {
        if (value !== untracked) {
          local = value;
        }
      }
    });

    let update = (next: string) => {
      let value = stringToInteger(next);
      property.update(value ?? fallback);
    };

    let onInput = (next: string) => {
      local = next;
      update(next);
    };

    let onBlur = (next: string) => {
      local = value;
      update(next);
    };

    return options({
      value: getter(() => local),
      onInput,
      onBlur,
    });
  };

  export type NumberPropertyEditor = ReturnType<typeof useNumberPropertyEditor>;
</script>

<script lang="ts">
  let { editor }: { editor: NumberPropertyEditor } = $props();
</script>

<Input value={editor.value} onInput={editor.onInput} onBlur={editor.onBlur} />
