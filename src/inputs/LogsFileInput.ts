import { FileInput } from "./FileInput";

export class LogsFileInput extends FileInput {
  constructor(formElement: HTMLElement) {
    const element = formElement.querySelector(
      '[data-bhwf-input="logs"]'
    ) as HTMLInputElement | null;

    const errorMsgElement = formElement.querySelector('[data-bhwf-error-msg="logs"]') as HTMLElement | null;

    const validator = (value: FileList | null) => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            element?.classList.add('bhwf-error');
            if (errorMsgElement) {
              errorMsgElement.innerText = 'Files cannot be images or videos';
            }
            return false;
          }
        }
      }
      return true;
    };

    const onInput = () => {
      element?.classList.remove('bhwf-error');
      if (errorMsgElement) {
        errorMsgElement.innerText = '';
      }
    }

    super({ element, errorMsgElement, validator, onInput });
  }
}
