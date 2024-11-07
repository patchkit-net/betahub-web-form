export class Input {
  isDisabled: boolean = false;
  inputElement?: HTMLInputElement
  errorMsgElement?: HTMLElement
  charCounter?: HTMLElement
  validator?: ((value: string) => [boolean, string | undefined])

  constructor({
    inputElement,
    errorMsgElement,
    validator,
  }: {
    inputElement?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    validator?: (value: string) => [boolean, string | undefined];
  }) {
    

    this.isDisabled = inputElement === null;
    if (this.isDisabled) return;

    this.inputElement = inputElement;
    this.errorMsgElement = errorMsgElement;
    this.validator = validator;

    // Character counter
    const countChars = inputElement?.getAttribute("data-bhwf-counter") !== null;
    if (countChars) {
      this.charCounter = document.createElement("span");
      this.charCounter.classList.add("char-counter");
      this.charCounter.innerText = "0";
      this.inputElement?.parentElement?.appendChild(this.charCounter);
    }

    this.inputElement?.addEventListener("input", () => {
      if (this.charCounter !== undefined) {
        this.charCounter.innerText = this.inputElement?.value.length.toString() || "0";
      }
    });
  }

  validate = (): [boolean, string | undefined] => this.validator?.(this.getValue()) ?? [true, undefined];
  getValue = (): string => (this.inputElement !== undefined ? this.inputElement.value : "");
  reset = () => {
    if (this.inputElement !== undefined) this.inputElement.value = "";
  };
}
