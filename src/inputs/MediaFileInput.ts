import { FormElements } from "../types";
import { FileInput } from "./FileInput";

export class MediaFileInput extends FileInput {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["media"]) {
    super({ inputElement, errorMsgElement });
  }
}
