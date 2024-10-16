import { Input } from './Input';

export class DescriptionInput extends Input {
  constructor(formElement: HTMLElement) {
    const validator = (value: string) => {
      const isValid = value.length > 50;
      if (isValid === false) {
        this.element?.classList.add('bhwf-error');
        if (this.errorMsgElement) {
          this.errorMsgElement.innerText = 'Description must be at least 50 characters long';
        }
      }
      return isValid;
    };

    const onInput = () => {
      this.element?.classList.remove('bhwf-error');
      if (this.errorMsgElement) {
        this.errorMsgElement.innerText = '';
      }
    }

    super({
      name: 'description',
      formElement,
      validator,
      onInput,
    });
  }
}