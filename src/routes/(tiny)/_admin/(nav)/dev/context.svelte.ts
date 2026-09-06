export class FieldsContext {
  isTouched = $state(false);
  touch() {
    this.isTouched = true;
  }
}
