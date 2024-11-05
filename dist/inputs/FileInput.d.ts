import Dropzone from "dropzone";
export declare class FileInput {
    isDisabled: boolean;
    inputElement?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    dropzone?: Dropzone;
    validator?: (value?: FileList) => [boolean, string | undefined];
    constructor({ inputElement, errorMsgElement, dropzone, validator, }: {
        inputElement?: HTMLInputElement;
        errorMsgElement?: HTMLElement;
        dropzone?: Dropzone;
        validator?: (value?: FileList) => [boolean, string | undefined];
    });
    validate: () => [boolean, string | undefined];
    getValue: () => FileList | undefined;
    reset: () => void;
}
