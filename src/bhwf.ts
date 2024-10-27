import { Form } from "./Form";
import { BHWF } from "./types";

export * as API from "./api";
export * from "./types";
export { Form } from "./Form";

export const init = () => {
  const formElements = document.querySelectorAll(
    "[data-bhwf-form]"
  ) as NodeListOf<HTMLElement>;
  formElements.forEach((formElement) => {
    const projectId = formElement.getAttribute("data-bhwf-form");
    if (!projectId) {
      throw new Error("Project ID for data-bhwf-form is required");
    }
    const bhwfForm = new Form({ formElement });
    bhwf.forms[projectId] = bhwfForm;
  });
};

const bhwf: BHWF = {
  init,
  forms: {} as { [projectId: string]: Form },
};
window.bhwf = bhwf;

document.addEventListener("DOMContentLoaded", () => {
  bhwf.init();
});
