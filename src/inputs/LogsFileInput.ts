import { FormElements } from "../types";
import { FileInput } from "./FileInput";

export class LogsFileInput extends FileInput {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["logs"]) {
    const validator = (value: FileList | undefined): [boolean, string | undefined] => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            return [false, 'Files cannot be images or videos'];
          }
        }
      }
      return [true, undefined];
    };

    super({ inputElement, errorMsgElement, validator });
  }
}
