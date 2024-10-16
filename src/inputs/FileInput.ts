export class FileInput {
  isDisabled: boolean = false;
  element: HTMLInputElement | null = null;
  errorMsgElement: HTMLElement | null = null;
  dropZoneElement: HTMLElement | null = null;
  fileListElement: HTMLElement | null = null;
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
    const errorMsgElement = formElement.querySelector(`[data-bhwf-error-msg="${name}"]`) as HTMLElement | null;
    const dropZoneElement = formElement.querySelector(`[data-bhwf-drop-zone="${name}"]`) as HTMLElement | null;
    const fileListElement = formElement.querySelector(`[data-bhwf-file-list="${name}"]`) as HTMLElement | null;

    this.isDisabled = element === null;
    if (this.isDisabled) return;

    this.element = element;

    this.errorMsgElement = errorMsgElement;
    this.dropZoneElement = dropZoneElement;
    this.fileListElement = fileListElement;
    this.validator = validator || null;

    if (onInput) {
      element?.addEventListener("input", (e) =>
        onInput((e.target as HTMLInputElement).files)
      );
    }

    // Drag & drop
    const dropZoneOriginalText = dropZoneElement?.innerText || "";
    if (element && dropZoneElement) {
      element.style.display = "none";

      dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("bhwf-drag-over");
        dropZoneElement.innerText = "Drop here";
      });
      dropZoneElement.addEventListener("dragleave", () => {
        dropZoneElement.classList.remove("bhwf-drag-over");
        dropZoneElement.innerText = dropZoneOriginalText;
      });
      dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZoneElement.classList.remove("bhwf-drag-over");
        const files = (e.dataTransfer?.files || null) as FileList | null;
        if (files) {
          element.files = files;
          element.dispatchEvent(new Event("input"));
          dropZoneElement.innerText = dropZoneOriginalText;
        }
      });
      dropZoneElement.addEventListener("click", () => element.click());
    }

    // File list
    if (fileListElement) {
    let selectedFiles: any[] = [];

    element?.addEventListener("input", () => {
        fileListElement.innerHTML = "";
        if (element?.files) {
            selectedFiles = Array.from(element.files);
            updateFileList();
        }
    });

    function updateFileList() {
      if (!fileListElement) return;

        fileListElement.innerHTML = "";
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const li = document.createElement("li");
            const img = document.createElement("img");

            if (file.type.startsWith("image/")) {
                img.src = URL.createObjectURL(file);
                img.onload = function () {
                    URL.revokeObjectURL(img.src);
                };
                img.classList.add("thumbnail");
                li.appendChild(img);
            }

            const textNode = document.createTextNode(file.name);
            li.appendChild(textNode);

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => {
                selectedFiles.splice(i, 1);
                updateFileList();
                if (errorMsgElement) errorMsgElement.innerText = "";
                if (dropZoneElement) dropZoneElement.classList.remove("bhwf-error");
            });
            li.appendChild(removeButton);

            fileListElement.appendChild(li);
        }

        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(file => dataTransfer.items.add(file));
        if (element) {
            element.files = dataTransfer.files;
        }
    }
}
  }

  validate = (): boolean => this.validator?.(this.getValue()) ?? true;
  getValue = (): FileList | null =>
    this.element !== null ? this.element.files : null;
  reset = () => {
    if (this.element !== null) this.element.value = "";
    if (this.fileListElement !== null) this.fileListElement.innerHTML = "";
  };
}
