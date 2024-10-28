import { FormElements } from "../types";
import { FileInput } from "./FileInput";

export class ScreenshotsFileInput extends FileInput {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["screenshots"]) {
    const validator = (value: FileList | undefined) => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (!file.type.startsWith("image/")) {
            this.inputElement?.classList.add('bhwf-error');
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
      this.inputElement?.classList.remove('bhwf-error');
      this.dropzone?.element.classList.remove('bhwf-error');
      if (this.errorMsgElement) {
        this.errorMsgElement.innerText = '';
      }
    }

    super({ inputElement, errorMsgElement, validator, onInput });
  }
}
