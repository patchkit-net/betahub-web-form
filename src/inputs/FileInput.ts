export class FileInput {
  isDisabled: boolean = false;
  element: HTMLInputElement | null = null;
  errorMsgElement: HTMLElement | null = null;
  validator: ((value: FileList | null) => boolean) | null = null;

  constructor({
    element = null,
    errorMsgElement = null,
    validator,
    onInput,
  }: {
    element?: HTMLInputElement | null;
    errorMsgElement?: HTMLElement | null;
    validator?: (value: FileList | null) => boolean;
    onInput?: (value: FileList | null) => void;
  }) {
    this.isDisabled = element === null;
    if (this.isDisabled) return;

    this.element = element;

    this.errorMsgElement = errorMsgElement;
    this.validator = validator || null;

    if (onInput) {
      element?.addEventListener("input", (e) =>
        onInput((e.target as HTMLInputElement).files)
      );
    }
  }

  validate = (): boolean => this.validator?.(this.getValue()) ?? true;
  getValue = (): FileList | null => (this.element !== null ? this.element.files : null);
  setValue = (value: string) => {
    if (this.element !== null) this.element.value = value;
  };
}
