import { DescriptionInput } from "./inputs/DescriptionInput";
import { Input } from "./inputs/Input";
import * as API from "./api";
import { CreateNewIssueArgs } from "./types";
import { StepsToReproduceInput } from "./inputs/StepsToReproduceInput";
import { FileInput } from "./inputs/FileInput";
import { ScreenshotsFileInput } from "./inputs/ScreenshotsFileInput";
import { VideosFileInput } from "./inputs/VideosFileInput";
import { LogsFileInput } from "./inputs/LogsFileInput";

export class Form {
  projectId: string | null = null;
  inputs: { [inputName: string]: Input } = {};
  fileInputs: { [inputName: string]: FileInput } = {};

  formElement: HTMLElement;

  constructor({ formElement }: { formElement: HTMLElement }) {
    this.projectId = formElement.getAttribute("data-bhwf-form");
    this.formElement = formElement;

    this._loadDefaultInputs();
    this._handleButtons();
  }

  _loadDefaultInputs() {
    this.inputs = {
      description: new DescriptionInput(this.formElement),
      stepsToReproduce: new StepsToReproduceInput(this.formElement),
    };
    this.inputs = Object.fromEntries(
      Object.entries(this.inputs).filter(([key, input]) => !input.isDisabled)
    );

    this.fileInputs = {
      screenshots: new ScreenshotsFileInput(this.formElement),
      videos: new VideosFileInput(this.formElement),
      logs: new LogsFileInput(this.formElement),
    };
    this.fileInputs = Object.fromEntries(
      Object.entries(this.fileInputs).filter(
        ([key, input]) => !input.isDisabled
      )
    );
  }

  _handleButtons() {
    const submitButtons = this.formElement.querySelectorAll(
      '[data-bhwf-button="submit"]'
    );
    submitButtons.forEach((submitButton: Element) => {
      (submitButton as HTMLButtonElement).addEventListener("click", () => {
        if (this.validate()) {
          this.submit();
        }
      });
    });

    const resetButtons = this.formElement.querySelectorAll(
      '[data-bhwf-button="reset"]'
    );
    resetButtons.forEach((resetButton: Element) => {
      (resetButton as HTMLButtonElement).addEventListener("click", () => {
        Object.values(this.inputs).map((input) => input.setValue(""));
        this.formElement.removeAttribute("data-bhwf-state");
      });
    });
  }

  validate = () => {
    const allInputs = [...Object.values(this.inputs), ...Object.values(this.fileInputs)];
    return allInputs.reduce((isValidSoFar, input) => input.validate() && isValidSoFar, true);
};

  async submit() {
    if (!this.projectId) return;

    const inputsData = {
      description: this.inputs.description?.getValue() || undefined,
      stepsToReproduce: this.inputs.stepsToReproduce?.getValue() || undefined,
    } as CreateNewIssueArgs;

    const fileInputsData = {
      screenshots: this.fileInputs.screenshots?.getValue() || undefined,
      videos: this.fileInputs.videos?.getValue() || undefined,
      logs: this.fileInputs.logs?.getValue() || undefined,
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

      this.formElement.setAttribute("data-bhwf-state", "success");
    } catch (error) {
      this.formElement.setAttribute("data-bhwf-state", "error");
    }
  }
}
