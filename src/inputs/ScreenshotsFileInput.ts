import { FormElements } from "../types";
import { FileInput } from "./FileInput";

export class ScreenshotsFileInput extends FileInput {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["screenshots"]) {
    const validator = (value: FileList | undefined): [boolean, string | undefined] => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (!file.type.startsWith("image/")) {
            return [false, 'All files must be images'];
          }
        }
      }
      return [true, undefined];
    };

    super({ inputElement, errorMsgElement, validator });
  }
}
