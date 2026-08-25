import { flip, offset, shift, type ComputePositionConfig } from '@floating-ui/dom';

export const basic: ComputePositionConfig = {
  placement: 'bottom-start',
  middleware: [offset(3), flip(), shift({ padding: 5 })],
};
