import "betahub-web-form/dist/bhwf.min.css";
import BHWF from "betahub-web-form";

const descriptionInputElement = document.getElementById('description-input') as HTMLInputElement;
const descriptionErrorMsgElement = document.getElementById('description-error-msg') as HTMLSpanElement;
const stepsToReproduceInputElement = document.getElementById('steps-to-reproduce-input') as HTMLInputElement;
const mediaInputElement = document.getElementById('media-input') as HTMLInputElement;

const submitButtonElement = document.getElementById('submit-button') as HTMLButtonElement;
const resetButtonElement = document.getElementById('reset-button') as HTMLButtonElement;
const retryButtonElement = document.getElementById('retry-button') as HTMLButtonElement;

const form = new BHWF.Form({
  projectId: 'asd',
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

submitButtonElement.addEventListener('click', (e) => {
  e.preventDefault();
  if (form.validate()) {
    form.submit();
  }
});

resetButtonElement.addEventListener('click', (e) => {
  e.preventDefault();
  form.reset();
});

retryButtonElement.addEventListener('click', (e) => {
  e.preventDefault();
  if (form.validate()) {
    form.submit();
  }
});