import Dropzone from "dropzone";
export declare class FileInput {
    isDisabled: boolean;
    element: HTMLInputElement | null;
    errorMsgElement: HTMLElement | null;
    dropzone: Dropzone | null;
    validator: ((value: FileList | null) => boolean) | null;
    constructor({ formElement, name, validator, onInput, }: {
        formElement: HTMLElement;
        name: string;
        validator?: (value: FileList | null) => boolean;
        onInput?: (value: FileList | null) => void;
    });
    validate: () => boolean;
    getValue: () => FileList | null;
    reset: () => void;
}
