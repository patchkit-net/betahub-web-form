import "betahub-web-form/dist/bhwf.min.css";
import * as BHWF from "betahub-web-form";

const formElement = document.getElementById('form') as HTMLElement;
const descriptionInputElement = document.getElementById('description-input') as HTMLInputElement;
const descriptionErrorMsgElement = document.getElementById('description-error-msg') as HTMLSpanElement;
const stepsToReproduceInputElement = document.getElementById('steps-to-reproduce-input') as HTMLInputElement;
const mediaInputElement = document.getElementById('media-input') as HTMLInputElement;
const submitButtonElement = document.getElementById('submit-button') as HTMLButtonElement;
const resetButtonElement = document.getElementById('reset-button') as HTMLButtonElement;
const retryButtonElement = document.getElementById('retry-button') as HTMLButtonElement;

const form = new BHWF.Form({
  projectId: '',
  formElement
});

console.log(form);