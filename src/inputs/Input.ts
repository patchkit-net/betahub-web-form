export class Input {
  isDisabled: boolean = false;
  inputElement?: HTMLInputElement
  errorMsgElement?: HTMLElement
  validator?: ((value: string) => boolean)

  constructor({
    inputElement,
    errorMsgElement,
    validator,
    onInput,
  }: {
    inputElement?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    validator?: (value: string) => boolean;
    onInput?: (value: string) => void;
  }) {
    

    this.isDisabled = inputElement === null;
    if (this.isDisabled) return;

    this.inputElement = inputElement;
    this.errorMsgElement = errorMsgElement;
    this.validator = validator;

    if (onInput) {
      inputElement?.addEventListener("input", (e: Event) =>
        onInput((e.target as HTMLInputElement)?.value || "")
      );
    }
  }

  validate = (): boolean => this.validator?.(this.getValue()) ?? true;
  getValue = (): string => (this.inputElement !== undefined ? this.inputElement.value : "");
  reset = () => {
    if (this.inputElement !== undefined) this.inputElement.value = "";
  };
}
