export class Input {
  isDisabled: boolean = false;
  element?: HTMLInputElement
  errorMsgElement?: HTMLElement
  validator?: ((value: string) => boolean)

  constructor({
    element,
    errorMsgElement,
    validator,
    onInput,
  }: {
    element?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    validator?: (value: string) => boolean;
    onInput?: (value: string) => void;
  }) {
    

    this.isDisabled = element === null;
    if (this.isDisabled) return;

    this.element = element;
    this.errorMsgElement = errorMsgElement;
    this.validator = validator;

    if (onInput) {
      element?.addEventListener("input", (e: Event) =>
        onInput((e.target as HTMLInputElement)?.value || "")
      );
    }
  }

  validate = (): boolean => this.validator?.(this.getValue()) ?? true;
  getValue = (): string => (this.element !== undefined ? this.element.value : "");
  reset = () => {
    if (this.element !== undefined) this.element.value = "";
  };
}
