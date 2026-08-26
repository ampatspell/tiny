<script module lang="ts">
</script>

<script lang="ts">
  import Button from '$lib/tiny/button/button.svelte';

  let input = $state<HTMLInputElement>();

  let oninput = (e: Event) => {
    let target = e.target as HTMLInputElement;
    console.log(target.value);
  };
</script>

<div class="page">
  <div class="picker">
    <input bind:this={input} class="input" type="color" {oninput} />
    <Button label="Select color" onClick={() => input?.click()} />
  </div>
</div>

<style lang="scss">
  .page {
    padding: 50px;
    display: flex;
    flex-direction: column;

    .picker {
      display: flex;
      width: min-content;
      position: relative;
      > .input {
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 0;
        padding: 0;
        border: none;
        opacity: 0;
        pointer-events: none;
      }
    }
  }
</style>
