import Dropzone from "dropzone";
import { transformIntoDropzone } from "../functions";

export class FileInput {
  isDisabled: boolean = false;
  inputElement?: HTMLInputElement;
  errorMsgElement?: HTMLElement;
  dropzone?: Dropzone;
  validator?: (value?: FileList) => [boolean, string | undefined];

  constructor({
    inputElement,
    errorMsgElement,
    validator,
  }: {
    inputElement?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    validator?: (value?: FileList) => [boolean, string | undefined];
  }) {
    this.isDisabled = inputElement === null;
    if (this.isDisabled) return;

    this.inputElement = inputElement;
    this.errorMsgElement = errorMsgElement;
    this.validator = validator;

    // Dropzone
    const isDropzone = inputElement?.getAttribute("data-bhwf-dropzone") !== null;
    if (inputElement && isDropzone) {
      const dropzone = transformIntoDropzone(inputElement);
      this.dropzone = dropzone;
    }
  }

  validate = (): [boolean, string | undefined] => this.validator?.(this.getValue()) ?? [true, undefined];
  getValue = (): FileList | undefined =>
    this.inputElement !== undefined ? this.inputElement.files || undefined : undefined;
  reset = () => {
    if (this.inputElement !== undefined) this.inputElement.value = "";
    if (this.dropzone !== undefined) this.dropzone.removeAllFiles();
  };
}

