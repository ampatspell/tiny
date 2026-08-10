<script lang="ts">
  import { getIndex } from '#lib/index.remote';

  let index = $derived(await getIndex());

  let background = $derived.by(() => {
    const id = index.backgroundId;
    if (id) {
      return `url("/files/${id}")`;
    }
  });
</script>

<div class={['page', background && 'has-background']} style:--background={background}>
  <div class="row">{index.title}</div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 50px;
    background: var(--background);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    &.has-background {
      color: #fff;
    }
  }
</style>
