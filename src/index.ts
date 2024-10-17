import { Form } from './Form';

export * from './types';
export * as API from './api';

export const init = () => {
  const forms = document.querySelectorAll('[data-bhwf-form]') as NodeListOf<HTMLElement>;
  forms.forEach((formElement) => {
    new Form({ formElement });
  });
};

declare global {
  interface Window {
    bhwf: {
      init: () => void;
      forms: { [projectId: string]: Form };
    };
  }
}

const bhwf = {
  init,
  forms: {},
};
window.bhwf = bhwf;

document.addEventListener('DOMContentLoaded', () => {
  bhwf.init();
});
