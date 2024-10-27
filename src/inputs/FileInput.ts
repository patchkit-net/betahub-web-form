import Dropzone from "dropzone";

export class FileInput {
  isDisabled: boolean = false;
  element?: HTMLInputElement;
  errorMsgElement?: HTMLElement;
  dropzone?: Dropzone;
  validator?: (value?: FileList) => boolean;

  constructor({
    element,
    errorMsgElement,
    validator,
    onInput,
  }: {
    element?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    validator?: (value?: FileList) => boolean;
    onInput?: (value?: FileList) => void;
  }) {
    this.isDisabled = element === null;
    if (this.isDisabled) return;

    this.element = element;
    this.errorMsgElement = errorMsgElement;
    this.validator = validator;

    if (onInput) {
      element?.addEventListener("input", (e) =>
        onInput((e.target as HTMLInputElement).files || undefined)
      );
    }

    // Dropzone
    const isDropzone = element?.getAttribute("data-bhwf-dropzone") !== null;
    if (element && isDropzone) {
      const dropzone = createDropzone(element);
      this.dropzone = dropzone;
    }
  }

  validate = (): boolean => this.validator?.(this.getValue()) ?? true;
  getValue = (): FileList | undefined =>
    this.element !== undefined ? this.element.files || undefined : undefined;
  reset = () => {
    if (this.element !== undefined) this.element.value = "";
    if (this.dropzone !== undefined) this.dropzone.removeAllFiles();
  };
}

const createDropzone = (element: HTMLInputElement) => {
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

  return dropzone;
};
