import { FileInput } from "./FileInput";

export class ScreenshotsFileInput extends FileInput {
  constructor(formElement: HTMLElement) {
    const element = formElement.querySelector(
      '[data-bhwf-input="screenshots"]'
    ) as HTMLInputElement | null;

    const errorMsgElement = formElement.querySelector('[data-bhwf-error-msg="screenshots"]') as HTMLElement | null;

    const validator = (value: FileList | null) => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (!file.type.startsWith("image/")) {
            element?.classList.add('bhwf-error');
            if (errorMsgElement) {
              errorMsgElement.innerText = 'All files must be images';
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
