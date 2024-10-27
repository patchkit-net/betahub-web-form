import { getInputElements } from "../functions";
import { Input } from "./Input";

export class DescriptionInput extends Input {
  constructor({
    formElement,
    element,
    errorMsgElement,
  }: {
    formElement?: HTMLElement;
    element?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
  }) {
    const validator = (value: string) => {
      const isValid = value.length > 50;
      if (isValid === false) {
        this.element?.classList.add("bhwf-error");
        if (this.errorMsgElement) {
          this.errorMsgElement.innerText =
            "Description must be at least 50 characters long";
        }
      }
      return isValid;
    };

    const onInput = () => {
      this.element?.classList.remove("bhwf-error");
      if (this.errorMsgElement) {
        this.errorMsgElement.innerText = "";
      }
    };

    const {
      element: autoDetectedElement,
      errorMsgElement: autoDetectedErrorMsgElement,
    } = getInputElements(formElement, "description");

    if (element === undefined) {
      element = autoDetectedElement;
    }
    if (errorMsgElement === undefined) {
      errorMsgElement = autoDetectedErrorMsgElement;
    }

    super({
      element,
      errorMsgElement,
      validator,
      onInput,
    });
  }
}
