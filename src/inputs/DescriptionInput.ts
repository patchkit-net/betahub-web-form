import { Input } from './Input';

export class DescriptionInput extends Input {
  constructor(formElement: HTMLElement) {
    const element = formElement.querySelector(
      '[data-bhwf-input="description"]'
    ) as HTMLInputElement | null;
    
    if (element === null) {
      super({
        isDisabled: true,
      });

      return;
    }

    const errorMsgElement = formElement.querySelector('[data-bhwf-error-msg="description"]') as HTMLElement | null;

    const validator = (value: string) => {
      const isValid = value.length > 50;
      if (isValid === false) {
        element.classList.add('bhwf-error');
        if (errorMsgElement) {
          errorMsgElement.innerText = 'Description must be at least 50 characters long';
        }
      }
      return isValid;
    };

    const onInput = () => {
      element.classList.remove('bhwf-error');
      if (errorMsgElement) {
        errorMsgElement.innerText = '';
      }
    }

    super({
      element,
      errorMsgElement,
      validator,
      onInput,
    });
  }
}