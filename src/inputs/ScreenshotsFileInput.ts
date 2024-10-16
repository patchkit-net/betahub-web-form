import { FileInput } from "./FileInput";

export class ScreenshotsFileInput extends FileInput {
  constructor(formElement: HTMLElement) {
    const validator = (value: FileList | null) => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (!file.type.startsWith("image/")) {
            this.element?.classList.add('bhwf-error');
            this.dropZoneElement?.classList.add('bhwf-error');
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
      if (this.errorMsgElement) {
        this.errorMsgElement.innerText = '';
      }
    }

    super({ name: 'screenshots', formElement, validator, onInput });
  }
}
