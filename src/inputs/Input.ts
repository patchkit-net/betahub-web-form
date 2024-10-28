export class Input {
  isDisabled: boolean = false;
  inputElement?: HTMLInputElement
  errorMsgElement?: HTMLElement
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
  }

  validate = (): [boolean, string | undefined] => this.validator?.(this.getValue()) ?? [true, undefined];
  getValue = (): string => (this.inputElement !== undefined ? this.inputElement.value : "");
  reset = () => {
    if (this.inputElement !== undefined) this.inputElement.value = "";
  };
}
