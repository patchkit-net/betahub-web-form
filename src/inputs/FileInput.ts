import Dropzone from "dropzone";
import { transformIntoDropzone } from "../functions";

export class FileInput {
  isDisabled: boolean = false;
  inputElement?: HTMLInputElement;
  errorMsgElement?: HTMLElement;
  dropzone?: Dropzone;
  validator?: (value?: FileList) => boolean;

  constructor({
    inputElement,
    errorMsgElement,
    validator,
    onInput,
  }: {
    inputElement?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    validator?: (value?: FileList) => boolean;
    onInput?: (value?: FileList) => void;
  }) {
    this.isDisabled = inputElement === null;
    if (this.isDisabled) return;

    this.inputElement = inputElement;
    this.errorMsgElement = errorMsgElement;
    this.validator = validator;

    if (onInput) {
      inputElement?.addEventListener("input", (e) =>
        onInput((e.target as HTMLInputElement).files || undefined)
      );
    }

    // Dropzone
    const isDropzone = inputElement?.getAttribute("data-bhwf-dropzone") !== null;
    if (inputElement && isDropzone) {
      const dropzone = transformIntoDropzone(inputElement);
      this.dropzone = dropzone;
    }
  }

  validate = (): boolean => this.validator?.(this.getValue()) ?? true;
  getValue = (): FileList | undefined =>
    this.inputElement !== undefined ? this.inputElement.files || undefined : undefined;
  reset = () => {
    if (this.inputElement !== undefined) this.inputElement.value = "";
    if (this.dropzone !== undefined) this.dropzone.removeAllFiles();
  };
}

