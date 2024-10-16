import { DescriptionInput } from "./inputs/DescriptionInput";
import { Input } from "./inputs/Input";
import * as API from "./api";
import { CreateNewIssueArgs } from "./types";
import { StepsToReproduceInput } from "./inputs/StepsToReproduceInput";

export class Form {
  projectId: string | null = null;
  inputs: { [inputName: string]: Input } = {};

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
  }

  _handleButtons() {
    const submitButton = this.formElement.querySelector(
      '[data-bhwf-button="submit"]'
    ) as HTMLButtonElement;
    submitButton.addEventListener("click", () => {
      if (this.validate()) {
        this.submit();
      }
    });
  }

  validate = () => {
    return Object.values(this.inputs).every((input) => input.validate());
  };

  async submit() {
    if (!this.projectId) return;

    const data = Object.fromEntries(
      Object.entries(this.inputs).map(([key, input]) => [key, input.getValue()])
    ) as CreateNewIssueArgs;

    const { id: issueId } = await API.createNewIssue({
      ...data,
      projectId: this.projectId,
    });
    
    console.log(`Issue created with ID: ${issueId}`);
  }
}
