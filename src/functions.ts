import { BHWFData } from "./types";
import * as API from "./api";

export const loadElement = (
  selector: string,
  parent: ParentNode = document
) => {
  const element = parent.querySelector(selector);
  if (!element) return null;
  return element as HTMLElement;
};

export const loadForm = (element: HTMLElement) => {
  const projectId = element.getAttribute("bhwf-project-id");
  const descriptionInput = loadElement(
    "[bhwf-issue-description]",
    element
  ) as HTMLInputElement;
  const descriptionErrorMsgElement = loadElement(
    "[bhwf-issue-description-error-msg]",
    element
  ) as HTMLElement;
  const stepsToReproduceInput = loadElement(
    "[bhwf-issue-steps]"
  ) as HTMLInputElement;
  const mediaInput = loadElement(
    "[bhwf-issue-media]",
    element
  ) as HTMLInputElement;
  const screenshotsInput = loadElement(
    "[bhwf-issue-screenshots]",
    element
  ) as HTMLInputElement;
  const videosInput = loadElement(
    "[bhwf-issue-videos]",
    element
  ) as HTMLInputElement;
  const logFilesInput = loadElement(
    "[bhwf-issue-logs]",
    element
  ) as HTMLInputElement;

  return {
    projectId,
    inputs: {
      description: descriptionInput,
      stepsToReproduce: stepsToReproduceInput,
      media: mediaInput,
      screenshots: screenshotsInput,
      videos: videosInput,
      logs: logFilesInput,
    },
    errorMsgs: {
      description: descriptionErrorMsgElement,
    }
  };
};

export const createIssue = async (data: BHWFData) => {
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

export const attachScreenshots = async (data: BHWFData) => {
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

export const attachLogFiles = async (data: BHWFData) => {
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
