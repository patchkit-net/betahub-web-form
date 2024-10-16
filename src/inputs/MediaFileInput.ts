import { FileInput } from "./FileInput";

export class MediaFileInput extends FileInput {
  constructor(formElement: HTMLElement) {
    const element = formElement.querySelector(
      '[data-bhwf-input="media"]'
    ) as HTMLInputElement | null;

    const errorMsgElement = formElement.querySelector('[data-bhwf-error-msg="media"]') as HTMLElement | null;
    const dropZoneElement = formElement.querySelector('[data-bhwf-drop-zone="media"]') as HTMLElement | null;
    const fileListElement = formElement.querySelector('[data-bhwf-file-list="media"]') as HTMLElement | null;

    super({ element, errorMsgElement, dropZoneElement, fileListElement });
  }
}
