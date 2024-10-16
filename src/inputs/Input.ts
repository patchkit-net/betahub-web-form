export class Input {
  isDisabled: boolean = false;
  element: HTMLInputElement | null = null;
  errorMsgElement: HTMLElement | null = null;
  validator: ((value: string) => boolean) | null = null;

  constructor({
    name,
    formElement,
    validator,
    onInput,
  }: {
    name: string;
    formElement: HTMLElement;
    validator?: (value: string) => boolean;
    onInput?: (value: string) => void;
  }) {
    const element = formElement.querySelector(
      `[data-bhwf-input="${name}"]`
    ) as HTMLInputElement | null;
    const errorMsgElement = formElement.querySelector(`[data-bhwf-error-msg="${name}"]`) as HTMLElement | null;

    this.isDisabled = element === null;
    if (this.isDisabled) return;

    this.element = element;

    this.errorMsgElement = errorMsgElement;
    this.validator = validator || null;

    if (onInput) {
      element?.addEventListener("input", (e: Event) =>
        onInput((e.target as HTMLInputElement)?.value || "")
      );
    }
  }

  validate = (): boolean => this.validator?.(this.getValue()) ?? true;
  getValue = (): string => (this.element !== null ? this.element.value : "");
  reset = () => {
    if (this.element !== null) this.element.value = "";
  };
}
