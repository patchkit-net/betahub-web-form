import { getInputElements } from "../functions";
import { FileInput } from "./FileInput";

export class MediaFileInput extends FileInput {
  constructor({
    formElement,
    element,
    errorMsgElement,
  }: {
    formElement?: HTMLElement;
    element?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
  }) {
    const {
      element: autoDetectedElement,
      errorMsgElement: autoDetectedErrorMsgElement,
    } = getInputElements(formElement, "media");

    if (element === undefined) {
      element = autoDetectedElement;
    }
    if (errorMsgElement === undefined) {
      errorMsgElement = autoDetectedErrorMsgElement;
    }

    super({ element, errorMsgElement });
  }
}
