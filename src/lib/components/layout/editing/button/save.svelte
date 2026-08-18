<script lang="ts">
  import BusyButton from '$lib/playground/busy-button.svelte';

  let { onSave }: { onSave: () => Promise<void> } = $props();
</script>

<BusyButton label="Save" onClick={onSave} />
