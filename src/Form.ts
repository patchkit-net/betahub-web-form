import { Input } from "./inputs/Input";
import * as API from "./api";
import {
  CreateNewIssueArgs,
  EventDataMap,
  EventType,
  FormElements,
  InputName,
} from "./types";
import { FileInput } from "./inputs/FileInput";
import { deepMerge, getFormElements } from "./functions";

export class Form {
  projectId?: string;
  formElement?: HTMLElement;
  inputs: Partial<{ [inputName in InputName]: Input }> = {};
  fileInputs: Partial<{ [inputName in InputName]: FileInput }> = {};
  private eventCallbacks: { [key in EventType]?: Array<(data?: EventDataMap[key]) => void> } = {};

  constructor({
    formElement,
    projectId,
    customElements,
  }: {
    formElement?: HTMLElement;
    projectId?: string;
    customElements?: Partial<FormElements>;
  }) {
    if (projectId === undefined) {
      if (formElement !== undefined) {
        projectId = formElement.getAttribute("data-bhwf-form") || undefined;
        if (projectId === undefined) {
          throw new Error(
            "projectId is required if data-bhwf-form attribute doesn't provide a value"
          );
        }
      } else {
        throw new Error("projectId is required if formElement is not provided");
      }
    }
    this.projectId = projectId;
    this.formElement = formElement;

    this._load({ customElements });

    this.on('inputError', (data) => {
      this.formElement?.setAttribute("data-bhwf-state", "inputError");
      data?.input?.inputElement?.classList.add("bhwf-error");
      if (data?.input instanceof FileInput) {
        data?.input?.dropzone?.element.classList.add("bhwf-error");
      }
      if (data?.input?.errorMsgElement) {
        data.input.errorMsgElement.innerText = data.message || '';
      }
    });
    this.on('apiError', (data) => {
      this.formElement?.setAttribute("data-bhwf-state", "apiError");
    });
    this.on('loading', () => {
      this.formElement?.setAttribute("data-bhwf-state", "loading");
    });
    this.on('success', () => {
      this.formElement?.setAttribute("data-bhwf-state", "success");
    });

    this.formElement?.addEventListener('input', this.cleanErrors);
  }

  private _load({
    customElements,
  }: {
    customElements?: Partial<FormElements>;
  }) {
    const defaultValidators = {
      description: {
        validator: (value: string | undefined): [boolean, string | undefined] => {
          if (!value) return [false, "Description is required"];
          if (value.length < 50) return [false, "Description must be at least 50 characters"];
          return [true, undefined];
        },
      },
      screenshots: {
        validator: (value: File[] | undefined): [boolean, string | undefined] => {        
          if (value) {
            for (let i = 0; i < value.length; i++) {
              const file = value[i];
              if (!file.type.startsWith("image/")) {
                return [false, 'All files must be images'];
              }
            }
          }
          return [true, undefined];
        }
      },
      videos: {
        validator: (value: File[] | undefined): [boolean, string | undefined] => {        
          if (value) {
            for (let i = 0; i < value.length; i++) {
              const file = value[i];
              if (!file.type.startsWith("video/")) {
                return [false, 'All files must be videos'];
              }
            }
          }
          return [true, undefined];
        }
      },
      logs: {
        validator: (value: File[] | undefined): [boolean, string | undefined] => {        
          if (value) {
            for (let i = 0; i < value.length; i++) {
              const file = value[i];
              if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
                return [false, 'Files cannot be images or videos'];
              }
            }
          }
          return [true, undefined];
        }
      },
    };
    const defaultFormElements = deepMerge(getFormElements(this.formElement), defaultValidators);
    const formElements = deepMerge(
      customElements || {},
      defaultFormElements
    );

    this.inputs = {
      description: new Input({ ...formElements.description }),
      stepsToReproduce: new Input({
        ...formElements.stepsToReproduce,
      }),
    };
    this.inputs = Object.fromEntries(
      Object.entries(this.inputs).filter(([key, input]) => !input.isDisabled)
    );

    this.fileInputs = {
      screenshots: new FileInput({ ...formElements.screenshots }),
      videos: new FileInput({ ...formElements.videos }),
      logs: new FileInput({ ...formElements.logs }),
      media: new FileInput({ ...formElements.media }),
    };
    this.fileInputs = Object.fromEntries(
      Object.entries(this.fileInputs).filter(
        ([key, input]) => !input.isDisabled
      )
    );

    this._handleButtons();
  }

  private _handleButtons() {
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
        this.reset();
      });
    });
  }

  on<K extends keyof EventDataMap>(event: K, callback: (data?: EventDataMap[K]) => void): void {
    if (!this.eventCallbacks[event]) {
      this.eventCallbacks[event] = [];
    }
    this.eventCallbacks[event]!.push(callback);
  }

  emit<K extends keyof EventDataMap>(event: K, data?: EventDataMap[K]): void {
    const callbacks = this.eventCallbacks[event];
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  validate = () => {
    const allInputs = [
      ...Object.values(this.inputs),
      ...Object.values(this.fileInputs),
    ];
    return allInputs.reduce((isValidSoFar, input) => {
      const [isValid, errorMessage] = input.validate();
      if (!isValid) this.emit("inputError", { message: errorMessage, input });
      return isValid && isValidSoFar;
    }, true);
  };

  cleanErrors = () => {
    this.formElement?.removeAttribute("data-bhwf-state")
    const allInputs = [
      ...Object.values(this.inputs),
      ...Object.values(this.fileInputs),
    ];
    allInputs.forEach((input) => {
      input.inputElement?.classList.remove("bhwf-error");
      if (input instanceof FileInput) {
        input.dropzone?.element.classList.remove("bhwf-error");
      }
      if (input.errorMsgElement) {
        input.errorMsgElement.innerText = '';
      }
    });
  }

  reset() {
    Object.values(this.inputs).map((input) => input.reset());
    Object.values(this.fileInputs).map((input) => input.reset());
    this.formElement?.removeAttribute("data-bhwf-state");
  }

  async submit() {
    if (!this.projectId)
      throw new Error("projectId is required to submit the form");

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

    this.emit("loading");
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

      this.emit("success");
    } catch (error) {
      const errorResponse = await error as Response;
      const message = (await errorResponse.json()).error;
      const status = errorResponse.status;
      this.emit("apiError", { message, status });
    }
  }
}
