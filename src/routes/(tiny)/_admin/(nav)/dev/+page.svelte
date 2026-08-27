<script lang="ts">
  import Button from '$lib/tiny/button/button.svelte';
  import Actions from '$lib/tiny/form/actions.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import Form from '$lib/tiny/form/form.svelte';
  import { usePropertiesContext } from '$lib/tiny/properties/context.svelte.js';
  import { useDataProperties } from '$lib/tiny/properties/data.svelte.js';
  import Input from '$lib/tiny/properties/editors/input.svelte';
  import { useNumberEditor } from '$lib/tiny/properties/editors/number.svelte.js';
  import { useStringEditor } from '$lib/tiny/properties/editors/string.svelte.js';

  usePropertiesContext();
  let properties = useDataProperties({ data: { name: 'hello', cats: 1 } });
  let name = properties.property('name');
  let cats = properties.property('cats');

  let onClick = () => {
    if (properties.touch()) {
      let data = properties.data;
      console.log(data);
    }
  };
</script>

<div class="page">
  <Form>
    <Content>
      <Row>
        <Input editor={useStringEditor({ property: name })} />
      </Row>
      <Row>
        <Input editor={useNumberEditor({ property: cats })} />
      </Row>
      <Actions>
        <Button label="Save" {onClick} />
      </Actions>
    </Content>
  </Form>
</div>

<style lang="scss">
  .page {
    padding: 20px;
  }
</style>
