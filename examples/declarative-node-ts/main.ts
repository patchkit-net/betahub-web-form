import * as BHWF from 'betahub-web-form';

const init = () => {
  const descriptionInput = document.getElementById('description-input') as HTMLInputElement;
  const descriptionErrorMsg = document.getElementById('description-error-msg') as HTMLSpanElement;
  const stepsToReproduceInput = document.getElementById('steps-to-reproduce-input') as HTMLInputElement;
  const mediaInput = document.getElementById('media-input') as HTMLInputElement;
  const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
  const resetButton = document.getElementById('reset-button') as HTMLButtonElement;
  const retryButton = document.getElementById('retry-button') as HTMLButtonElement;
}

console.log(BHWF.API);