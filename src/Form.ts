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
  projectId: string;
  apiKey: string;
  formElement?: HTMLElement | HTMLFormElement;
  inputs: Partial<{ [inputName in InputName]: Input }> = {};
  fileInputs: Partial<{ [inputName in InputName]: FileInput }> = {};
  private eventCallbacks: {
    [key in EventType]?: Array<(data?: EventDataMap[key]) => void>;
  } = {};
  errorApiMsgElement?: HTMLElement;
  progressElement?: HTMLElement;
  progressMsgElement?: HTMLElement;
  latestIssueUrl?: string;

  constructor({
    formElement,
    projectId,
    apiKey,
    customElements,
  }: {
    formElement?: HTMLElement | HTMLFormElement;
    projectId?: string;
    apiKey?: string;
    customElements?: Partial<FormElements>;
  }) {
    if (projectId === undefined) {
      throw new Error("projectId is required");
    }
    if (apiKey === undefined) {
      throw new Error("apiKey is required");
    }
    this.projectId = projectId;
    this.apiKey = apiKey;
    this.formElement = formElement;

    this._load({ customElements });

    this.on("inputError", (data) => {
      this.formElement?.setAttribute("data-bhwf-state", "inputError");
      data?.input?.inputElement?.classList.add("bhwf-error");
      if (data?.input instanceof FileInput) {
        data?.input?.dropzone?.element.classList.add("bhwf-error");
      }
      if (data?.input?.errorMsgElement) {
        data.input.errorMsgElement.innerText = data.message || "";
      }
    });
    this.on("apiError", (data) => {
      console.log("apiError", data);
      this.formElement?.setAttribute("data-bhwf-state", "apiError");
      if (this.errorApiMsgElement) {
        this.errorApiMsgElement.innerText = data?.message || "";
      }
    });
    this.on("loading", () => {
      this.formElement?.setAttribute("data-bhwf-state", "loading");
    });
    this.on("progress", (data) => {
      if (this.progressElement) {
        this.progressElement.innerText =
          data?.progress !== undefined ? Math.round(data.progress) + "%" : "";
      }
      if (this.progressMsgElement) {
        this.progressMsgElement.innerText = data?.message || "";
      }
    });
    this.on("success", (data) => {
      this.formElement?.setAttribute("data-bhwf-state", "success");

      const viewIssueButtons =
        this.formElement?.querySelectorAll('[data-bhwf-button="viewIssue"]') ||
        [];
      viewIssueButtons.forEach((viewIssueButton: Element) => {
        (viewIssueButton as HTMLAnchorElement).setAttribute(
          "href",
          data?.issueUrl || ""
        );
      });
    });

    this.formElement?.addEventListener("input", this.cleanErrors);
  }

  private _load({
    customElements,
  }: {
    customElements?: Partial<FormElements>;
  }) {
    const defaultValidators = {
      description: {
        validator: (
          value: string | undefined
        ): [boolean, string | undefined] => {
          if (!value) return [false, "Description is required"];
          if (value.length < 50)
            return [false, "Description must be at least 50 characters"];
          return [true, undefined];
        },
      },
      screenshots: {
        validator: (
          value: File[] | undefined
        ): [boolean, string | undefined] => {
          if (value) {
            for (let i = 0; i < value.length; i++) {
              const file = value[i];
              if (!file.type.startsWith("image/")) {
                return [false, "All files must be images"];
              }
            }
          }
          return [true, undefined];
        },
      },
      videos: {
        validator: (
          value: File[] | undefined
        ): [boolean, string | undefined] => {
          if (value) {
            for (let i = 0; i < value.length; i++) {
              const file = value[i];
              if (!file.type.startsWith("video/")) {
                return [false, "All files must be videos"];
              }
            }
          }
          return [true, undefined];
        },
      },
      logs: {
        validator: (
          value: File[] | undefined
        ): [boolean, string | undefined] => {
          if (value) {
            for (let i = 0; i < value.length; i++) {
              const file = value[i];
              if (
                file.type.startsWith("image/") ||
                file.type.startsWith("video/")
              ) {
                return [false, "Files cannot be images or videos"];
              }
            }
          }
          return [true, undefined];
        },
      },
    };
    const defaultFormElements = deepMerge(
      getFormElements(this.formElement),
      defaultValidators
    );
    const formElements = deepMerge(defaultFormElements, customElements || {});

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

    if (this.formElement) {
      this.errorApiMsgElement =
        this.formElement.querySelector('[data-bhwf-error-msg="api"]') ||
        undefined;

      this.progressElement =
        this.formElement.querySelector("[data-bhwf-progress]") || undefined;

      this.progressMsgElement =
        this.formElement.querySelector("[data-bhwf-progress-msg]") || undefined;
    }

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

    const tryAgainButtons = this.formElement.querySelectorAll(
      '[data-bhwf-button="tryAgain"]'
    );
    tryAgainButtons.forEach((tryAgainButton: Element) => {
      (tryAgainButton as HTMLButtonElement).addEventListener("click", (e) => {
        e.preventDefault();
        this.formElement?.removeAttribute("data-bhwf-state");
      });
    });
  }

  on<K extends keyof EventDataMap>(
    event: K,
    callback: (data?: EventDataMap[K]) => void
  ): void {
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
    this.formElement?.removeAttribute("data-bhwf-state");
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
        input.errorMsgElement.innerText = "";
      }
    });
    this.emit("cleanErrors");
  };

  reset = () => {
    this.cleanErrors();
    Object.values(this.inputs).map((input) => input.reset());
    Object.values(this.fileInputs).map((input) => input.reset());
    this.emit("reset");
  };

  async submit() {
    const inputsData: CreateNewIssueArgs = {
      description: this.inputs.description?.getValue() || undefined,
      stepsToReproduce: this.inputs.stepsToReproduce?.getValue() || undefined,
    } as CreateNewIssueArgs;

    const fileInputsData = {
      screenshots: this.fileInputs.screenshots?.getValue() || [],
      videos: this.fileInputs.videos?.getValue() || [],
      logs: this.fileInputs.logs?.getValue() || [],
      media: this.fileInputs.media?.getValue() || [],
    };

    const allFiles = [
      ...Array.from(fileInputsData.screenshots),
      ...Array.from(fileInputsData.videos),
      ...Array.from(fileInputsData.logs),
      ...Array.from(fileInputsData.media),
    ];

    const totalFiles: number = allFiles.length;
    let uploadedFiles: number = 0;

    const totalFileSize: number = allFiles.reduce(
      (acc, file) => acc + (file.size || 0),
      0
    );
    let uploadedFileSize: number = 0;

    this.emit("loading");
    this.emit("progress", { message: "Creating issue" });

    const { id: issueId, url: issueUrl } = await API.createNewIssue({
      ...inputsData,
      projectId: this.projectId,
      apiKey: this.apiKey,
    }).catch((errorRequest) => {
      const message = JSON.parse(errorRequest.response).error;
      const status = errorRequest.status;
      this.emit("apiError", { message, status });
      throw errorRequest;
    });

    const uploadFile = async (
      uploadFunction: Function,
      file: { screenshot?: File; videoClip?: File; logFile?: File }
    ): Promise<void> => {
      let previousLoaded = 0;
      await uploadFunction({
        projectId: this.projectId,
        apiKey: this.apiKey,
        issueId,
        ...file,
        onProgress: (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const loaded = event.loaded - previousLoaded;
            previousLoaded = event.loaded;
            uploadedFileSize += loaded;

            const progress = (uploadedFileSize / totalFileSize) * 100;
            this.emit("progress", {
              progress: progress > 100 ? 100 : progress,
              message: `Uploading files: ${uploadedFiles + 1}/${totalFiles}`,
            });
          }
        },
      })
        .then(() => {
          uploadedFiles += 1;
        })
        .catch((errorRequest: XMLHttpRequest) => {
          const message = JSON.parse(errorRequest.response).error;
          const status = errorRequest.status;
          this.emit("apiError", { message, status });
          throw errorRequest;
        });
    };

    for (const screenshot of fileInputsData.screenshots) {
      await uploadFile(API.uploadScreenshot, { screenshot });
    }
    for (const videoClip of fileInputsData.videos) {
      await uploadFile(API.uploadVideoClip, { videoClip });
    }
    for (const logFile of fileInputsData.logs) {
      await uploadFile(API.uploadLogFile, { logFile });
    }

    for (const mediaFile of fileInputsData.media) {
      const fileType: string = mediaFile.type;
      if (fileType.startsWith("image/")) {
        await uploadFile(API.uploadScreenshot, { screenshot: mediaFile });
      } else if (fileType.startsWith("video/")) {
        await uploadFile(API.uploadVideoClip, { videoClip: mediaFile });
      } else {
        await uploadFile(API.uploadLogFile, { logFile: mediaFile });
      }
    }

    this.emit("success", { issueId, issueUrl });
  }
}
