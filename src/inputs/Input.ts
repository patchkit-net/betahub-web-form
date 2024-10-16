export class Input {
  isDisabled: boolean = false;
  element: HTMLInputElement | null = null;
  errorMsgElement: HTMLElement | null = null;
  validator: ((value: string) => boolean) | null = null;

  constructor({
    isDisabled = false,
    element = null,
    errorMsgElement = null,
    validator,
    onInput,
  }: {
    isDisabled?: boolean;
    element?: HTMLInputElement | null;
    errorMsgElement?: HTMLElement | null;
    validator?: (value: string) => boolean;
    onInput?: (value: string) => void;
  }) {
    this.isDisabled = isDisabled;
    this.element = element;
    this.errorMsgElement = errorMsgElement;
    this.validator = validator || null;

    if (onInput) {
      element?.addEventListener("input", (e: Event) =>
        onInput((e.target as HTMLInputElement)?.value || "")
      );
    }
  }

  validate = (): boolean => this.validator?.(this.getValue()) ?? false;
  getValue = (): string => (this.element !== null ? this.element.value : "");
  setValue = (value: string) => {
    if (this.element !== null) this.element.value = value;
  };
}
