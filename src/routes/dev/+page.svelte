<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import { pickFile } from '$lib/utils/files.svelte.js';

  const onClick = async () => {
    let res = await pickFile({
      accept: ['image/png', 'image/jpeg'],
    });

    console.log(res);
  };
</script>

<div class="dev">
  <Button label="Pick" {onClick} />
</div>

<style lang="scss">
  .dev {
    padding: 10px;
  }
</style>
