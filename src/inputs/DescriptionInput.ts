import { FormElements } from "../types";
import { Input } from "./Input";

export class DescriptionInput extends Input {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["description"]) {
    const validator = (value: string) => {
      const isValid = value.length > 50;
      if (isValid === false) {
        this.inputElement?.classList.add("bhwf-error");
        if (this.errorMsgElement) {
          this.errorMsgElement.innerText =
            "Description must be at least 50 characters long";
        }
      }
      return isValid;
    };

    const onInput = () => {
      this.inputElement?.classList.remove("bhwf-error");
      if (this.errorMsgElement) {
        this.errorMsgElement.innerText = "";
      }
    };

    super({
      inputElement,
      errorMsgElement,
      validator,
      onInput,
    });
  }
}
