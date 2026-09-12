export class FieldsContext {
  isTouched = $state(false);

  touch() {
    this.isTouched = true;
  }

  untouch() {
    this.isTouched = false;
  }
}
