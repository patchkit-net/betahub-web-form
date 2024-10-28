import * as API from "./api";
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

export const loadElement = (
  selector: string,
  parent: ParentNode = document
) => {
  const element = parent.querySelector(selector);
  if (!element) return null;
  return element as HTMLElement;
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

export const createIssue = async (data: any) => {
  const { projectId, inputs: { description: descriptionInput } } = data;

  if (!projectId) throw new Error("Project ID is required");
  if (!descriptionInput) throw new Error("Description input not found");
  if (!descriptionInput.value) throw new Error("Description is required");

  const issueResponse = await API.createNewIssue({
    projectId,
    description: descriptionInput.value,
  });

  data.issueId = issueResponse.id;
  return data;
};

export const attachScreenshots = async (data: any) => {
  const { projectId, issueId, inputs: { description: descriptionInput, screenshots: screenshotsInput } } = data;

  if (!projectId) throw new Error("Project ID is required");
  if (!issueId) throw new Error("Issue is not yet created");

  if (
    screenshotsInput &&
    screenshotsInput.files &&
    screenshotsInput.files.length > 0
  ) {
    for (const screenshot of screenshotsInput.files) {
      console.log("Screenshot:", screenshot.name);
      await API.uploadScreenshot({
        projectId,
        issueId,
        screenshot,
      });
    }
  }
};

export const attachLogFiles = async (data: any) => {
  const { projectId, issueId, inputs: { description: descriptionInput, screenshots: screenshotsInput } } = data;

  if (!projectId) throw new Error("Project ID is required");
  if (!issueId) throw new Error("Issue is not yet created");

  if (
    screenshotsInput &&
    screenshotsInput.files &&
    screenshotsInput.files.length > 0
  ) {
    for (const screenshot of screenshotsInput.files) {
      console.log("Screenshot:", screenshot.name);
      await API.uploadScreenshot({
        projectId,
        issueId,
        screenshot,
      });
    }
  }
};
