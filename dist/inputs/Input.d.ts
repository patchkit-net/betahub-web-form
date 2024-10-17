export declare class Input {
    isDisabled: boolean;
    element: HTMLInputElement | null;
    errorMsgElement: HTMLElement | null;
    validator: ((value: string) => boolean) | null;
    constructor({ name, formElement, validator, onInput, }: {
        name: string;
        formElement: HTMLElement;
        validator?: (value: string) => boolean;
        onInput?: (value: string) => void;
    });
    validate: () => boolean;
    getValue: () => string;
    reset: () => void;
}
