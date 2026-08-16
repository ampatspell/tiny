import { flip, offset, shift, type ComputePositionConfig } from '@floating-ui/dom';

export const basic: ComputePositionConfig = {
  placement: 'bottom-end',
  middleware: [offset(5), flip(), shift({ padding: 5 })],
};
