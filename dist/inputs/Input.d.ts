export declare class Input {
    isDisabled: boolean;
    inputElement?: HTMLInputElement;
    errorMsgElement?: HTMLElement;
    validator?: ((value: string) => [boolean, string | undefined]);
    constructor({ inputElement, errorMsgElement, validator, }: {
        inputElement?: HTMLInputElement;
        errorMsgElement?: HTMLElement;
        validator?: (value: string) => [boolean, string | undefined];
    });
    validate: () => [boolean, string | undefined];
    getValue: () => string;
    reset: () => void;
}
