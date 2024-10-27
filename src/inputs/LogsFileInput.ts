import { getInputElements } from "../functions";
import { FileInput } from "./FileInput";

export class LogsFileInput extends FileInput {
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
          if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            this.element?.classList.add('bhwf-error');
            this.dropzone?.element.classList.add('bhwf-error');
            if (this.errorMsgElement) {
              this.errorMsgElement.innerText = 'Files cannot be images or videos';
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
    } = getInputElements(formElement, "logs");

    if (element === undefined) {
      element = autoDetectedElement;
    }
    if (errorMsgElement === undefined) {
      errorMsgElement = autoDetectedErrorMsgElement;
    }

    super({ element, errorMsgElement, validator, onInput });
  }
}
