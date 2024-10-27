import Dropzone from "dropzone";
export declare class FileInput {
    isDisabled: boolean;
    element?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    dropzone?: Dropzone;
    validator?: (value?: FileList) => boolean;
    constructor({ element, errorMsgElement, validator, onInput, }: {
        element?: HTMLInputElement;
        errorMsgElement?: HTMLElement;
        validator?: (value?: FileList) => boolean;
        onInput?: (value?: FileList) => void;
    });
    validate: () => boolean;
    getValue: () => FileList | undefined;
    reset: () => void;
}
