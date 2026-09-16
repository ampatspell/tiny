<script lang="ts">
  import { isTruthy } from '#lib/tiny/utils/array.js';
  import { elementContainsEventTarget } from '#lib/tiny/utils/dom.js';
  import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
  import { images } from '#lib/tiny/utils/utils.js';
  import type { Attachment } from 'svelte/attachments';
  import { on } from 'svelte/events';

  const fileDrop = (model: FileDropModel): Attachment<HTMLElement> => {
    const fileItemsFromEvent = (e: DragEvent) => {
      let items = e.dataTransfer?.items ?? [];
      let all = [...items].filter((item) => item.kind === 'file') ?? [];
      let accepted = all.filter((item) => model.accept.includes(item.type));
      return { all, accepted };
    };

    return (element) => {
      let onDragOver = (e: DragEvent) => {
        const { all, accepted } = fileItemsFromEvent(e);
        if (all.length > 0) {
          e.preventDefault();
          if (e.dataTransfer) {
            if (accepted.length > 0) {
              e.dataTransfer.dropEffect = 'copy';
              model.setOver(true);
            } else {
              e.dataTransfer.dropEffect = 'none';
            }
          }
        }
      };

      let onWindowDragOver = (e: DragEvent) => {
        const { all } = fileItemsFromEvent(e);
        if (all.length > 0) {
          e.preventDefault();
          if (!elementContainsEventTarget(element, e)) {
            if (e.dataTransfer) {
              e.dataTransfer.dropEffect = 'none';
            }
          }
        }
      };

      let onDragLeave = () => {
        model.setOver(false);
      };

      let onDrop = (e: DragEvent) => {
        let { all, accepted } = fileItemsFromEvent(e);
        if (all.length > 0) {
          e.preventDefault();
          if (accepted.length > 0) {
            let files = accepted.map((item) => item.getAsFile()).filter(isTruthy);
            model.onDrop(files);
          }
        }
        model.setOver(false);
      };

      let cancel = [
        on(element, 'dragover', onDragOver),
        on(element, 'dragleave', onDragLeave),
        on(element, 'drop', onDrop),
        on(window, 'dragover', onWindowDragOver),
      ];

      return () => {
        cancel.forEach((c) => c());
      };
    };
  };

  const createHandleDropModel = (
    _opts: OptionsInput<{
      onDrop: (files: File[]) => void;
      accept: string[];
    }>,
  ) => {
    const opts = options(_opts);
    let accept = $derived(opts.accept);
    let isOver = $state(false);
    let setOver = (over: boolean) => {
      isOver = over;
    };
    return options({
      accept: getter(() => accept),
      isOver: getter(() => isOver),
      setOver,
      onDrop: (files: File[]) => opts.onDrop(files),
    });
  };

  type FileDropModel = ReturnType<typeof createHandleDropModel>;

  let model = createHandleDropModel({
    accept: images,
    onDrop: (files) => {
      console.log('onDrop', files);
    },
  });

  $effect(() => console.log(model.isOver));
</script>

<div class="page">
  <div class="block" {@attach fileDrop(model)}></div>
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
