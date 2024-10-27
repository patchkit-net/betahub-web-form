import { DescriptionInput } from "./inputs/DescriptionInput";
import { Input } from "./inputs/Input";
import * as API from "./api";
import { CreateNewIssueArgs } from "./types";
import { StepsToReproduceInput } from "./inputs/StepsToReproduceInput";
import { FileInput } from "./inputs/FileInput";
import { ScreenshotsFileInput } from "./inputs/ScreenshotsFileInput";
import { VideosFileInput } from "./inputs/VideosFileInput";
import { LogsFileInput } from "./inputs/LogsFileInput";
import { MediaFileInput } from "./inputs/MediaFileInput";

export class Form {
  projectId?: string;
  formElement?: HTMLElement;
  inputs: { [inputName: string]: Input } = {};
  fileInputs: { [inputName: string]: FileInput } = {};

  constructor({
    projectId,
    formElement,
    inputs,
    errorMsgs,
    buttons,
  }: {
    projectId?: string
    formElement?: HTMLElement
    inputs?: { [inputName: string]: HTMLInputElement };
    errorMsgs?: { [inputName: string]: HTMLElement };
    buttons?: { [inputName: string]: HTMLButtonElement };
  }) {
    if (projectId === undefined) {
      if (formElement !== undefined) {
        projectId = formElement.getAttribute("data-bhwf-form") || undefined;
        if (projectId === undefined) {
          throw new Error("projectId is required for data-bhwf-form attribute");
        }
      } else {
        throw new Error("projectId is required if formElement is not provided");
      }
    }
    this.projectId = projectId;
    this.formElement = formElement;

    this._load({
      inputs,
      errorMsgs,
      buttons,
    });
  }

  _load({
    inputs,
    errorMsgs,
    buttons,
  }: {
    inputs?: { [inputName: string]: HTMLInputElement };
    errorMsgs?: { [inputName: string]: HTMLElement };
    buttons?: { [inputName: string]: HTMLButtonElement };
  }) {
    this.inputs = {
      description: new DescriptionInput({formElement: this.formElement}),
      stepsToReproduce: new StepsToReproduceInput({formElement: this.formElement}),
    };
    this.inputs = Object.fromEntries(
      Object.entries(this.inputs).filter(([key, input]) => !input.isDisabled)
    );

    this.fileInputs = {
      screenshots: new ScreenshotsFileInput({formElement: this.formElement}),
      videos: new VideosFileInput({formElement: this.formElement}),
      logs: new LogsFileInput({formElement: this.formElement}),
      media: new MediaFileInput({formElement: this.formElement}),
    };
    this.fileInputs = Object.fromEntries(
      Object.entries(this.fileInputs).filter(
        ([key, input]) => !input.isDisabled
      )
    );

    this._handleButtons();
  }

  _handleButtons() {
    if (!this.formElement) return;

    const submitButtons = this.formElement.querySelectorAll(
      '[data-bhwf-button="submit"]'
    );
    submitButtons.forEach((submitButton: Element) => {
      (submitButton as HTMLButtonElement).addEventListener("click", (e) => {
        e.preventDefault();
        if (this.validate()) {
          this.submit();
        }
      });
    });

    const resetButtons = this.formElement.querySelectorAll(
      '[data-bhwf-button="reset"]'
    );
    resetButtons.forEach((resetButton: Element) => {
      (resetButton as HTMLButtonElement).addEventListener("click", (e) => {
        e.preventDefault();
        if (!this.formElement) return;

        Object.values(this.inputs).map((input) => input.reset());
        Object.values(this.fileInputs).map((input) => input.reset());
        this.formElement.removeAttribute("data-bhwf-state");
      });
    });
  }

  validate = () => {
    const allInputs = [
      ...Object.values(this.inputs),
      ...Object.values(this.fileInputs),
    ];
    return allInputs.reduce(
      (isValidSoFar, input) => input.validate() && isValidSoFar,
      true
    );
  };

  async submit() {
    if (!this.formElement) return;
    if (!this.projectId) return;

    const inputsData = {
      description: this.inputs.description?.getValue() || undefined,
      stepsToReproduce: this.inputs.stepsToReproduce?.getValue() || undefined,
    } as CreateNewIssueArgs;

    const fileInputsData = {
      screenshots: this.fileInputs.screenshots?.getValue() || undefined,
      videos: this.fileInputs.videos?.getValue() || undefined,
      logs: this.fileInputs.logs?.getValue() || undefined,
      media: this.fileInputs.media?.getValue() || undefined,
    };

    this.formElement.setAttribute("data-bhwf-state", "loading");
    try {
      const { id: issueId } = await API.createNewIssue({
        ...inputsData,
        projectId: this.projectId,
      });

      if (fileInputsData.screenshots && fileInputsData.screenshots.length > 0) {
        for (const screenshot of fileInputsData.screenshots) {
          await API.uploadScreenshot({
            projectId: this.projectId,
            issueId,
            screenshot,
          });
        }
      }

      if (fileInputsData.videos && fileInputsData.videos.length > 0) {
        for (const videoClip of fileInputsData.videos) {
          await API.uploadVideoClip({
            projectId: this.projectId,
            issueId,
            videoClip,
          });
        }
      }

      if (fileInputsData.logs && fileInputsData.logs.length > 0) {
        for (const logFile of fileInputsData.logs) {
          await API.uploadLogFile({
            projectId: this.projectId,
            issueId,
            logFile,
          });
        }
      }

      if (fileInputsData.media && fileInputsData.media.length > 0) {
        for (const mediaFile of fileInputsData.media) {
          const fileType = mediaFile.type;

          if (fileType.startsWith("image/")) {
            await API.uploadScreenshot({
              projectId: this.projectId,
              issueId,
              screenshot: mediaFile,
            });
          } else if (fileType.startsWith("video/")) {
            await API.uploadVideoClip({
              projectId: this.projectId,
              issueId,
              videoClip: mediaFile,
            });
          } else {
            await API.uploadLogFile({
              projectId: this.projectId,
              issueId,
              logFile: mediaFile,
            });
          }
        }
      }

      this.formElement.setAttribute("data-bhwf-state", "success");
    } catch (error) {
      this.formElement.setAttribute("data-bhwf-state", "error");
    }
  }
}
