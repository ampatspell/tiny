import type { Attachment } from 'svelte/attachments';
import { elementContainsEventTarget } from './utils/dom.ts';
import { isTruthy } from './utils/array.ts';
import { on } from 'svelte/events';
import { getter, options, type OptionsInput } from './utils/options.svelte.ts';

export const fileDrop = (model: FileDropModel): Attachment<HTMLElement> => {
  const fileItemsFromEvent = (e: DragEvent) => {
    const items = e.dataTransfer?.items ?? [];
    const all = [...items].filter((item) => item.kind === 'file') ?? [];
    const accepted = all.filter((item) => model.accept.includes(item.type));
    let isValid;
    if (model.multiple) {
      isValid = accepted.length > 0;
    } else {
      isValid = all.length === 1 && accepted.length === 1;
    }
    return { all, accepted, isValid };
  };

  return (element) => {
    const onDragOver = (e: DragEvent) => {
      const { all, isValid } = fileItemsFromEvent(e);
      if (all.length > 0) {
        e.preventDefault();
        if (e.dataTransfer) {
          if (isValid) {
            e.dataTransfer.dropEffect = 'copy';
            model.setOver(true);
          } else {
            e.dataTransfer.dropEffect = 'none';
          }
        }
      }
    };

    const onWindowDragOver = (e: DragEvent) => {
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

    const onDragLeave = () => {
      model.setOver(false);
    };

    const onDrop = (e: DragEvent) => {
      const { all, accepted, isValid } = fileItemsFromEvent(e);
      if (all.length > 0) {
        e.preventDefault();
        if (isValid) {
          const files = accepted.map((item) => item.getAsFile()).filter(isTruthy);
          model.onDrop(files);
        }
      }
      model.setOver(false);
    };

    const cancel = [
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

export const createFileDropModel = (
  _opts: OptionsInput<{
    onDrop: (files: File[]) => void;
    accept: string[];
    multiple?: boolean;
  }>,
) => {
  const opts = options(_opts);
  const onDrop = $derived(opts.onDrop);
  const accept = $derived(opts.accept);
  const multiple = $derived(opts.multiple ?? false);
  let isOver = $state(false);
  const setOver = (over: boolean) => {
    isOver = over;
  };
  return options({
    multiple: getter(() => multiple),
    isOver: getter(() => isOver),
    accept: getter(() => accept),
    onDrop: getter(() => onDrop),
    setOver,
  });
};

export type FileDropModel = ReturnType<typeof createFileDropModel>;
