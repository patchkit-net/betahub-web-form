import Dropzone from "dropzone";
export declare class FileInput {
    isDisabled: boolean;
    inputElement?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    dropzone?: Dropzone;
    validator?: (value?: FileList) => boolean;
    constructor({ inputElement, errorMsgElement, validator, onInput, }: {
        inputElement?: HTMLInputElement;
        errorMsgElement?: HTMLElement;
        validator?: (value?: FileList) => boolean;
        onInput?: (value?: FileList) => void;
    });
    validate: () => boolean;
    getValue: () => FileList | undefined;
    reset: () => void;
}
