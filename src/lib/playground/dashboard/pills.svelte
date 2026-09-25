<script lang="ts">
  import Label from '#lib/tiny/calendar/month/grid/pills/pill/label.svelte';
  import Pills from '#lib/tiny/calendar/month/grid/pills/pills.svelte';
  import { createRenderable } from '#lib/tiny/render.svelte';
  import { isTruthy } from '#lib/tiny/utils/array.js';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { pluralize } from '#lib/tiny/utils/string.js';

  let props: {
    date: Temporal.PlainDate;
    files: {
      createdAt: Temporal.ZonedDateTime;
      id: string;
      name: string;
    }[];
  } = $props();

  let filtered = $derived(props.files.filter((file) => file.createdAt.toPlainDate().equals(props.date)));

  let files = $derived.by(() => {
    if (filtered.length) {
      return createRenderable({
        component: Label,
        props: {
          label: getter(() => `Uploaded ${filtered.length} ${pluralize(filtered.length, 'file', 'files')}`),
        },
      });
    }
  });

  let pills = $derived([files].filter(isTruthy));
</script>

<Pills {pills} />
