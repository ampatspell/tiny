import Mixin from '@ember/object/mixin';

export default Mixin.create({

  async alert(message, cancel, confirm, fn) {
    let result = await this.present('application', 'alert', {
      message,
      actions: [
        { label: cancel,  status: 'cancelled' },
        { label: confirm, status: 'confirmed', color: 'warning', fn: () => fn && fn() }
      ]
    });

    let { status } = result;

    if(status === 'confirmed') {
      return true;
    }

    return false;
  }

});
