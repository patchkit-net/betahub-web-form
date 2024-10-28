import { FormElements } from "../types";
import { FileInput } from "./FileInput";

export class VideosFileInput extends FileInput {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["videos"]) {
    const validator = (value: FileList | undefined): [boolean, string | undefined] => {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (!file.type.startsWith("video/")) {
            return [false, 'All files must be videos'];
          }
        }
      }
      return [true, undefined];
    };

    super({ inputElement, errorMsgElement, validator });
  }
}
