import { Form } from "./Form";
import * as API from "./api";
import { BHWFI } from "./types";
import { autoInit } from "./functions";

const BHWF: BHWFI = {
  Form,
  API,
  autoInit: () => autoInit(BHWF),
  forms: {} as { [projectId: string]: Form },
};

document.addEventListener("DOMContentLoaded", () => {
  BHWF.autoInit();
  window.BHWF = BHWF;
});

export * from "./types";
export default BHWF;
