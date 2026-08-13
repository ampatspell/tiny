<script lang="ts">
  import { getIndex } from './index.remote.js';

  let index = $derived(await getIndex());

  let background = $derived.by(() => {
    const id = index.backgroundId;
    if (id) {
      return `url("/files/${id}")`;
    }
  });
</script>

<div class={['page', background && 'has-background']} style:--background={background}>
  <div class="title">{index.title}</div>
  <div class="description">{index.description}</div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 50px;
    background: var(--background);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    &.has-background {
      color: #fff;
    }
    > .title {
      font-size: 21px;
    }
    > .description {
      font-size: 13px;
    }
  }
</style>
