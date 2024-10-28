import { FormElements } from "../types";
import { FileInput } from "./FileInput";

export class LogsFileInput extends FileInput {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["logs"]) {
    const validator = (value: FileList | undefined) => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            this.inputElement?.classList.add('bhwf-error');
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
      this.inputElement?.classList.remove('bhwf-error');
      this.dropzone?.element.classList.remove('bhwf-error');
      if (this.errorMsgElement) {
        this.errorMsgElement.innerText = '';
      }
    }

    super({ inputElement, errorMsgElement, validator, onInput });
  }
}
