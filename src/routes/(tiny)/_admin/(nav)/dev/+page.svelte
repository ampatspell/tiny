<script lang="ts">
  let blowUp = () => {
    throw new Error('Fake');
  };
</script>

<div class="page">
  <div class="block">
    {blowUp()}
  </div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
    > .block {
      width: 100px;
      height: 100px;
      border: 1px solid #000;
      border-radius: 4px;
    }
  }
</style>
