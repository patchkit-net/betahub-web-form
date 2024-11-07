import { Input } from "./inputs/Input";
import { EventDataMap, FormElements, InputName } from "./types";
import { FileInput } from "./inputs/FileInput";
export declare class Form {
    projectId: string;
    apiKey: string;
    formElement?: HTMLElement | HTMLFormElement;
    inputs: Partial<{
        [inputName in InputName]: Input;
    }>;
    fileInputs: Partial<{
        [inputName in InputName]: FileInput;
    }>;
    private eventCallbacks;
    errorApiMsgElement?: HTMLElement;
    progressElement?: HTMLElement;
    progressMsgElement?: HTMLElement;
    latestIssueUrl?: string;
    constructor({ formElement, projectId, apiKey, customElements, }: {
        formElement?: HTMLElement | HTMLFormElement;
        projectId?: string;
        apiKey?: string;
        customElements?: Partial<FormElements>;
    });
    private _load;
    private _handleButtons;
    on<K extends keyof EventDataMap>(event: K, callback: (data?: EventDataMap[K]) => void): void;
    emit<K extends keyof EventDataMap>(event: K, data?: EventDataMap[K]): void;
    validate: () => boolean;
    cleanErrors: () => void;
    reset: () => void;
    submit(): Promise<void>;
}
