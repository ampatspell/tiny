<script lang="ts" module>
  import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
  import type { Any, InferPropsFromComponent } from '#lib/tiny/utils/utils.js';
  import type { Component } from 'svelte';

  export class Renderable<C extends Component<Any> = Component<Any>> {
    readonly component: C;
    readonly props: InferPropsFromComponent<C>;

    constructor(opts: { component: C; props: OptionsInput<InferPropsFromComponent<C>> }) {
      this.component = opts.component;
      this.props = options(opts.props);
    }
  }

  export const createRenderable = <C extends Component<Any> = Component<Any>>(
    ...args: ConstructorParameters<typeof Renderable<C>>
  ) => new Renderable(...args);
</script>

<script lang="ts" generics="R extends Renderable">
  let { renderable }: { renderable: R } = $props();

  let Declared = $derived(renderable.component);
  let declared = $derived(renderable.props);
</script>

<Declared {...declared} />
