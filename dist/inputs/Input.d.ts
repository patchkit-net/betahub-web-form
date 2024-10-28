export declare class Input {
    isDisabled: boolean;
    inputElement?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    validator?: ((value: string) => boolean);
    constructor({ inputElement, errorMsgElement, validator, onInput, }: {
        inputElement?: HTMLInputElement;
        errorMsgElement?: HTMLElement;
        validator?: (value: string) => boolean;
        onInput?: (value: string) => void;
    });
    validate: () => boolean;
    getValue: () => string;
    reset: () => void;
}
