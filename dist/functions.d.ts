import { BHWFI, FormElements, InputName } from "./types";
export declare const deepMerge: (target: any, source: any) => any;
export declare const autoInit: (BHWF: BHWFI) => void;
export declare const getInputElements: (parent: ParentNode | undefined, inputName: InputName) => {
    inputElement: HTMLInputElement | undefined;
    errorMsgElement: HTMLElement | undefined;
};
export declare const getFormElements: (formElement?: HTMLElement) => Partial<FormElements>;
