import { getInputElements } from "../functions";
import { FileInput } from "./FileInput";

export class ScreenshotsFileInput extends FileInput {
  constructor({
    formElement,
    element,
    errorMsgElement,
  }: {
    formElement?: HTMLElement;
    element?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
  }) {
    const validator = (value: FileList | undefined) => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (!file.type.startsWith("image/")) {
            this.element?.classList.add('bhwf-error');
            this.dropzone?.element.classList.add('bhwf-error');
            if (this.errorMsgElement) {
              this.errorMsgElement.innerText = 'All files must be images';
            }
            return false;
          }
        }
      }
      return true;
    };

    const onInput = () => {
      this.element?.classList.remove('bhwf-error');
      this.dropzone?.element.classList.remove('bhwf-error');
      if (this.errorMsgElement) {
        this.errorMsgElement.innerText = '';
      }
    }

    const {
      element: autoDetectedElement,
      errorMsgElement: autoDetectedErrorMsgElement,
    } = getInputElements(formElement, "screenshots");

    if (element === undefined) {
      element = autoDetectedElement;
    }
    if (errorMsgElement === undefined) {
      errorMsgElement = autoDetectedErrorMsgElement;
    }

    super({ element, errorMsgElement, validator, onInput });
  }
}
