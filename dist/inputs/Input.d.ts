export declare class Input {
    isDisabled: boolean;
    element?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    validator?: ((value: string) => boolean);
    constructor({ element, errorMsgElement, validator, onInput, }: {
        element?: HTMLInputElement;
        errorMsgElement?: HTMLElement;
        validator?: (value: string) => boolean;
        onInput?: (value: string) => void;
    });
    validate: () => boolean;
    getValue: () => string;
    reset: () => void;
}
