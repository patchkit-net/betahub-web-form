import { FormElements } from "../types";
import { Input } from "./Input";

export class DescriptionInput extends Input {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["description"]) {
    const validator = (value: string): [boolean, string | undefined] => {
      if (value.length < 50) {
        return [false, "Description must be at least 50 characters long"];
      }
      return [true, undefined];
    };

    super({
      inputElement,
      errorMsgElement,
      validator,
    });
  }
}
