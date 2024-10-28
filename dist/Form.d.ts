import { Input } from "./inputs/Input";
import { FormElements, InputName } from "./types";
import { FileInput } from "./inputs/FileInput";
export declare class Form {
    projectId?: string;
    formElement?: HTMLElement;
    inputs: Partial<{
        [inputName in InputName]: Input;
    }>;
    fileInputs: Partial<{
        [inputName in InputName]: FileInput;
    }>;
    constructor({ formElement, projectId, customElements, }: {
        formElement?: HTMLElement;
        projectId?: string;
        customElements?: Partial<FormElements>;
    });
    _load({ customElements }: {
        customElements?: Partial<FormElements>;
    }): void;
    _handleButtons(): void;
    validate: () => boolean;
    reset(): void;
    submit(): Promise<void>;
}
