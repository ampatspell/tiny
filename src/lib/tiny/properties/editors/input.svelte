<script lang="ts" generics="T">
  import Input from '$lib/tiny/input.svelte';
  import Container from '../container.svelte';
  import type { InputEditor } from './input.svelte.ts';

  let { editor }: { editor: InputEditor<T> } = $props();

  let property = $derived(editor.property);
</script>

<Container {property}>
  <Input value={editor.value} onInput={editor.onInput} onBlur={editor.onBlur} />
</Container>
