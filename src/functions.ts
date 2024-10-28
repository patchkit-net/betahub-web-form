import Dropzone from "dropzone";
import { BHWFI, FormElements, InputName } from "./types";

export const deepMerge = (target: any, source: any): any => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

export const autoInit = (BHWF: BHWFI) => {
  const formElements = document.querySelectorAll(
    "[data-bhwf-form]"
  ) as NodeListOf<HTMLElement>;
  formElements.forEach((formElement) => {
    const projectId = formElement.getAttribute("data-bhwf-form");
    if (!projectId) {
      throw new Error("Project ID for data-bhwf-form is required");
    }
    const bhwfForm = new BHWF.Form({ formElement });
    BHWF.forms[projectId] = bhwfForm;
  });
};

export const getInputElements = (parent: ParentNode = document, inputName: InputName) => {
  const inputElement = parent?.querySelector(
    `[data-bhwf-input="${inputName}"]`
  ) as HTMLInputElement | undefined || undefined;
  const errorMsgElement = parent?.querySelector(
    `[data-bhwf-error-msg="${inputName}"]`
  ) as HTMLElement | undefined || undefined;

  return { inputElement, errorMsgElement };
};

export const getFormElements = (formElement?: HTMLElement): Partial<FormElements> => {
  if (!formElement) return {} as FormElements;

  const inputNames: InputName[] = [
    "description",
    "stepsToReproduce",
    "screenshots",
    "videos",
    "logs",
    "media",
  ]

  const result: Partial<FormElements> = {};
  for (const inputName of inputNames) {
    const { inputElement, errorMsgElement } = getInputElements(formElement, inputName);
    result[inputName] = { inputElement, errorMsgElement };
  }

  return result;
};

export const transformIntoDropzone = (inputElement: HTMLInputElement) => {
  inputElement.style.display = "none";
  const dropzoneElement = document.createElement("form");
  dropzoneElement.classList.add("dropzone");
  inputElement.parentElement?.insertBefore(dropzoneElement, inputElement.nextSibling);
  const acceptedFiles = inputElement.getAttribute("accept") || undefined;

  const dropzone = new Dropzone(dropzoneElement, {
    url: "#",
    autoProcessQueue: false,
    addRemoveLinks: true,
    acceptedFiles,
  });

  const _syncFileInputFiles = () => {
    if (inputElement) {
      const fileList = new DataTransfer();
      dropzone.files.forEach((file) => fileList.items.add(file));
      inputElement.files = fileList.files;
      inputElement.dispatchEvent(new Event("input", { bubbles: true }));
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
