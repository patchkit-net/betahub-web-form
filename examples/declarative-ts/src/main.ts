import BHWF, { transformIntoDropzone } from "betahub-web-form";
import "betahub-web-form/dist/bhwf.min.css";
import "betahub-web-form/dist/dropzone.min.css";

const formElement = document.getElementById("form") as HTMLElement;
const descriptionInputElement = document.getElementById(
  "description-input"
) as HTMLInputElement;
const descriptionErrorMsgElement = document.getElementById(
  "description-error-msg"
) as HTMLSpanElement;
const stepsToReproduceInputElement = document.getElementById(
  "steps-to-reproduce-input"
) as HTMLInputElement;
const stepsToReproduceErrorMsgElement = document.getElementById(
  "steps-to-reproduce-error-msg"
) as HTMLInputElement;
const mediaInputElement = document.getElementById(
  "media-input"
) as HTMLInputElement;
const mediaErrorMsgElement = document.getElementById(
  "media-error-msg"
) as HTMLInputElement;

const loadingModalElement = document.getElementById(
  "loading-modal"
) as HTMLDivElement;
const errorModalElement = document.getElementById(
  "error-modal"
) as HTMLDivElement;
const errorTextElement = document.getElementById(
  "error-text"
) as HTMLSpanElement;
const successModalElement = document.getElementById(
  "success-modal"
) as HTMLDivElement;

const submitButtonElement = document.getElementById(
  "submit-button"
) as HTMLButtonElement;
const resetButtonElement = document.getElementById(
  "reset-button"
) as HTMLButtonElement;
const retryButtonElement = document.getElementById(
  "retry-button"
) as HTMLButtonElement;
const anotherButtonElement = document.getElementById(
  "another-button"
) as HTMLButtonElement;

const dropzone = transformIntoDropzone(mediaInputElement);

const form = new BHWF.Form({
  projectId: "pr-3251306887", // Set your project ID here
  apiKey:
    "tkn-6ed1b7c8928bbfb155f1e5d36d3def0d3f91a61d49992adc39c35fdde8c72675", // Set your API key here
  formElement,
  customElements: {
    description: {
      inputElement: descriptionInputElement,
      errorMsgElement: descriptionErrorMsgElement,
    },
    stepsToReproduce: {
      inputElement: stepsToReproduceInputElement,
      errorMsgElement: stepsToReproduceErrorMsgElement,
      validator: (value) => {
        if (!value) return [false, "Steps to reproduce are required"];
        return [true, undefined];
      },
    },
    media: {
      inputElement: mediaInputElement,
      errorMsgElement: mediaErrorMsgElement,
      dropzone: dropzone,
      validator: (value) => {
        if (value.length === 0) return [false, "Media are required"];
        return [true, undefined];
      },
    },
  },
});

form.on("loading", () => {
  loadingModalElement.classList.add("bhwf-modal-show");
});
form.on("apiError", (data) => {
  loadingModalElement.classList.remove("bhwf-modal-show");
  errorModalElement.classList.add("bhwf-modal-show");
  console.log(data);
  if (data?.status !== undefined) {
    errorTextElement.innerText = data?.message || "";
  }
});
form.on("inputError", () => {
  submitButtonElement.setAttribute("disabled", "true");
});
form.on("cleanErrors", () => {
  submitButtonElement.removeAttribute("disabled");
});
form.on("success", () => {
  loadingModalElement.classList.remove("bhwf-modal-show");
  successModalElement.classList.add("bhwf-modal-show");
});

submitButtonElement.addEventListener("click", (e) => {
  e.preventDefault();
  if (form.validate()) {
    form.submit();
  }
});

resetButtonElement.addEventListener("click", (e) => {
  e.preventDefault();
  errorModalElement.classList.remove("bhwf-modal-show");
  form.reset();
});

anotherButtonElement.addEventListener("click", (e) => {
  e.preventDefault();
  successModalElement.classList.remove("bhwf-modal-show");
  form.reset();
});

retryButtonElement.addEventListener("click", (e) => {
  e.preventDefault();
  errorModalElement.classList.remove("bhwf-modal-show");
});
