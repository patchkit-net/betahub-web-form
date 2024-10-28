import { FormElements } from "../types";
import { FileInput } from "./FileInput";

export class VideosFileInput extends FileInput {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["videos"]) {
    const validator = (value: FileList | undefined) => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (!file.type.startsWith("video/")) {
            this.inputElement?.classList.add('bhwf-error');
            this.dropzone?.element.classList.add('bhwf-error');
            if (this.errorMsgElement) {
              this.errorMsgElement.innerText = 'All files must be videos';
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
