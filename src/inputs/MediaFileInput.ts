import { FileInput } from "./FileInput";

export class MediaFileInput extends FileInput {
  constructor(formElement: HTMLElement) {
    super({ name: "media", formElement });
  }
}
