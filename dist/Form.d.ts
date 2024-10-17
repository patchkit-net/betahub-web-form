import { Input } from "./inputs/Input";
import { FileInput } from "./inputs/FileInput";
export declare class Form {
    projectId: string | null;
    inputs: {
        [inputName: string]: Input;
    };
    fileInputs: {
        [inputName: string]: FileInput;
    };
    formElement: HTMLElement;
    constructor({ formElement }: {
        formElement: HTMLElement;
    });
    _loadDefaultInputs(): void;
    _handleButtons(): void;
    validate: () => boolean;
    submit(): Promise<void>;
}
