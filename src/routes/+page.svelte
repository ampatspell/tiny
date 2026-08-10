<script lang="ts">
  import { getIndex } from '#lib/index.remote';
  import { resolve } from '$app/paths';

  let data = $derived(await getIndex());
  let background = $derived.by(() => {
    const id = data.background?.id;
    if (id) {
      return `url("/files/${id}")`;
    }
  });
</script>

<div class={['page', background && 'has-background']} style:--background={background}>
  <div class="row">{data.index.id} {data.index.title}</div>
  <div class="row"><a href={resolve('/backend')}>backend</a></div>
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
