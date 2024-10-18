import { FileInput } from "./FileInput";

export class VideosFileInput extends FileInput {
  constructor(formElement: HTMLElement) {
    const validator = (value: FileList | null) => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (!file.type.startsWith("video/")) {
            this.element?.classList.add('bhwf-error');
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
      this.element?.classList.remove('bhwf-error');
      this.dropzone?.element.classList.remove('bhwf-error');
      if (this.errorMsgElement) {
        this.errorMsgElement.innerText = '';
      }
    }

    super({ name: 'videos', formElement, validator, onInput });
  }
}
