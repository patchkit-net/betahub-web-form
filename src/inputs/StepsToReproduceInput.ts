import { Input } from "./Input";

export class StepsToReproduceInput extends Input {
  constructor(formElement: HTMLElement) {
    super({ name: 'stepsToReproduce', formElement });
  }
}
