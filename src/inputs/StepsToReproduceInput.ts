import { FormElements } from "../types";
import { Input } from "./Input";

export class StepsToReproduceInput extends Input {
  constructor({
    inputElement,
    errorMsgElement,
  }: FormElements["stepsToReproduce"]) {
    super({
      inputElement,
      errorMsgElement,
    });
  }
}
