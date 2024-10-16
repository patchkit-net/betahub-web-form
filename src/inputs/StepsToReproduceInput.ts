import { Input } from "./Input";

export class StepsToReproduceInput extends Input {
  constructor(formElement: HTMLElement) {
    const element = formElement.querySelector(
      '[data-bhwf-input="stepsToReproduce"]'
    ) as HTMLInputElement | null;

    super({ element });
  }
}
