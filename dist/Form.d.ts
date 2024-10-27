import { Input } from "./inputs/Input";
import { FileInput } from "./inputs/FileInput";
export declare class Form {
    projectId?: string;
    formElement?: HTMLElement;
    inputs: {
        [inputName: string]: Input;
    };
    fileInputs: {
        [inputName: string]: FileInput;
    };
    constructor({ projectId, formElement, inputs, errorMsgs, buttons, }: {
        projectId?: string;
        formElement?: HTMLElement;
        inputs?: {
            [inputName: string]: HTMLInputElement;
        };
        errorMsgs?: {
            [inputName: string]: HTMLElement;
        };
        buttons?: {
            [inputName: string]: HTMLButtonElement;
        };
    });
    _load({ inputs, errorMsgs, buttons, }: {
        inputs?: {
            [inputName: string]: HTMLInputElement;
        };
        errorMsgs?: {
            [inputName: string]: HTMLElement;
        };
        buttons?: {
            [inputName: string]: HTMLButtonElement;
        };
    }): void;
    _handleButtons(): void;
    validate: () => boolean;
    submit(): Promise<void>;
}
