<script lang="ts">
  import Button from '$lib/tiny/button/button.svelte';
  import { useFloaters } from '$lib/tiny/floating/floaters.svelte.js';
  import { dropdown } from '$lib/tiny/floating/layout/dropdown.svelte';
  import TablerCircleX from '$lib/tiny/icons/tabler--circle-x.svelte';
  import TablerPhoto from '$lib/tiny/icons/tabler--photo.svelte';

  let floaters = useFloaters();
  let button = $state<Button>();

  const onOpen = async () => {
    let reference = button?.element;
    if (reference) {
      let items = [
        {
          icon: TablerCircleX,
          label: 'Remove image',
          perform: () => {},
        },
        {
          icon: TablerPhoto,
          label: 'Replace image',
          perform: () => {},
        },
      ];

      let selected = await dropdown({
        floaters,
        reference,
        items,
      });

      console.log(selected);
    }
  };
</script>

<div class="dev">
  <Button bind:this={button} label="Open" onClick={onOpen} />
</div>

<style lang="scss">
  .dev {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
</style>
