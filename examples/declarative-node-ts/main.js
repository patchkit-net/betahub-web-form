import * as BHWF from 'betahub-web-form';
const init = () => {
    const descriptionInput = document.getElementById('description-input');
    const descriptionErrorMsg = document.getElementById('description-error-msg');
    const stepsToReproduceInput = document.getElementById('steps-to-reproduce-input');
    const mediaInput = document.getElementById('media-input');
    const submitButton = document.getElementById('submit-button');
    const resetButton = document.getElementById('reset-button');
    const retryButton = document.getElementById('retry-button');
};
console.log(BHWF.API);
