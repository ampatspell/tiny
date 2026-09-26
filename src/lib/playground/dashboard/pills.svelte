<script lang="ts">
  import Label from '#lib/tiny/calendar/month/grid/pills/pill/label.svelte';
  import Pills from '#lib/tiny/calendar/month/grid/pills/pills.svelte';
  import { createRenderable } from '#lib/tiny/render.svelte';
  import { isTruthy } from '#lib/tiny/utils/array.js';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { pluralize } from '#lib/tiny/utils/string.js';
  import { useDashboardContext } from './dashboard.svelte.js';

  let props: {
    date: Temporal.PlainDate;
  } = $props();

  let context = useDashboardContext();
  let date = $derived(context.createDate(props.date));

  let files = $derived.by(() => {
    let files = date.files.length;
    if (files) {
      return createRenderable({
        component: Label,
        props: {
          label: getter(() => `Uploaded ${files} ${pluralize(files, 'file', 'files')}`),
        },
      });
    }
  });

  let pills = $derived([files].filter(isTruthy));
</script>

<Pills {pills} />
