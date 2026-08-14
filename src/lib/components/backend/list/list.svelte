<script module lang="ts">
</script>

<script lang="ts">
</script>

<div class="list">
  <div class="overflow">
    <div class="content">list</div>
  </div>
</div>

<style lang="scss">
  .list {
    flex: 1;
    position: relative;
    > .overflow {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow-y: auto;
      > .content {
        display: flex;
        flex-direction: column;
        min-height: 100%;
      }
    }
  }
</style>
