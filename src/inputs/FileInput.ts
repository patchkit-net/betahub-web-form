import Dropzone from "dropzone";

export class FileInput {
  isDisabled: boolean = false;
  element: HTMLInputElement | null = null;
  errorMsgElement: HTMLElement | null = null;
  dropzone: Dropzone | null = null;
  validator: ((value: FileList | null) => boolean) | null = null;

  constructor({
    formElement,
    name,
    validator,
    onInput,
  }: {
    formElement: HTMLElement;
    name: string;
    validator?: (value: FileList | null) => boolean;
    onInput?: (value: FileList | null) => void;
  }) {
    const element = formElement.querySelector(
      `[data-bhwf-input="${name}"]`
    ) as HTMLInputElement | null;
    const errorMsgElement = formElement.querySelector(
      `[data-bhwf-error-msg="${name}"]`
    ) as HTMLElement | null;

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

    // Dropzone
    const isDropzone = element?.getAttribute("data-bhwf-dropzone") !== null;
    if (element && isDropzone) {
      element.style.display = "none";
      const dropzoneElement = document.createElement("form");
      dropzoneElement.classList.add("dropzone");
      element.parentElement?.insertBefore(dropzoneElement, element.nextSibling);
      const acceptedFiles = element.getAttribute("accept") || undefined;

      const dropzone = new Dropzone(dropzoneElement, {
        url: "#",
        autoProcessQueue: false,
        addRemoveLinks: true,
        acceptedFiles,
      });
      this.dropzone = dropzone;

      const _syncFileInputFiles = () => {
        if (element) {
          const fileList = new DataTransfer();
          dropzone.files.forEach((file) => fileList.items.add(file));
          element.files = fileList.files;
          element.dispatchEvent(new Event("input"));
        }
      };

      dropzone.on("addedfile", (file) => {
        dropzone.emit("complete", file);
        _syncFileInputFiles();
      });
      dropzone.on("queuecomplete", (file) => _syncFileInputFiles());
      dropzone.on("removedfile", (file) => _syncFileInputFiles());
    }
  }

  validate = (): boolean => this.validator?.(this.getValue()) ?? true;
  getValue = (): FileList | null =>
    this.element !== null ? this.element.files : null;
  reset = () => {
    if (this.element !== null) this.element.value = "";
    if (this.dropzone !== null) this.dropzone.removeAllFiles();
  };
}
