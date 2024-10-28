import "betahub-web-form/dist/bhwf.min.css";
import "betahub-web-form/dist/dropzone.min.css";
import BHWF, { transformIntoDropzone } from "betahub-web-form";

const descriptionInputElement = document.getElementById('description-input') as HTMLInputElement;
const descriptionErrorMsgElement = document.getElementById('description-error-msg') as HTMLSpanElement;
const stepsToReproduceInputElement = document.getElementById('steps-to-reproduce-input') as HTMLInputElement;
const mediaInputElement = document.getElementById('media-input') as HTMLInputElement;

const loadingModalElement = document.getElementById('loading-modal') as HTMLDivElement;
const errorModalElement = document.getElementById('error-modal') as HTMLDivElement;
const errorTextElement = document.getElementById('error-text') as HTMLSpanElement;
const successModalElement = document.getElementById('success-modal') as HTMLDivElement;

const submitButtonElement = document.getElementById('submit-button') as HTMLButtonElement;
const resetButtonElement = document.getElementById('reset-button') as HTMLButtonElement;
const retryButtonElement = document.getElementById('retry-button') as HTMLButtonElement;

transformIntoDropzone(mediaInputElement);

const form = new BHWF.Form({
  projectId: 'pr-3251306887', // Set your project ID here
  customElements: {
    description: {
      inputElement: descriptionInputElement,
      errorMsgElement: descriptionErrorMsgElement
    },
    stepsToReproduce: {
      inputElement: stepsToReproduceInputElement
    },
    media: {
      inputElement: mediaInputElement
    }
  }
});

form.on('loading', () => {
  loadingModalElement.classList.add('bhwf-modal-show');
})
form.on('apiError', (data) => {
  loadingModalElement.classList.remove('bhwf-modal-show');
  errorModalElement.classList.add('bhwf-modal-show');
  console.log(data)
  if (data?.status !== undefined) {
    if (data.status === 404) data.message = 'Project not found';
    errorTextElement.innerText = data?.message || '';
  }
})
form.on('success', () => {
  loadingModalElement.classList.remove('bhwf-modal-show');
  successModalElement.classList.add('bhwf-modal-show');
})

submitButtonElement.addEventListener('click', (e) => {
  e.preventDefault();
  if (form.validate()) {
    form.submit();
  }
});

resetButtonElement.addEventListener('click', (e) => {
  e.preventDefault();
  successModalElement.classList.remove('bhwf-modal-show');
  form.reset();
});

retryButtonElement.addEventListener('click', (e) => {
  e.preventDefault();
  if (form.validate()) {
    form.submit();
  }
});