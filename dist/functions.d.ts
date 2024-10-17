import { BHWFData } from "./types";
export declare const loadElement: (selector: string, parent?: ParentNode) => HTMLElement | null;
export declare const loadForm: (element: HTMLElement) => {
    projectId: string | null;
    inputs: {
        description: HTMLInputElement;
        stepsToReproduce: HTMLInputElement;
        media: HTMLInputElement;
        screenshots: HTMLInputElement;
        videos: HTMLInputElement;
        logs: HTMLInputElement;
    };
    errorMsgs: {
        description: HTMLElement;
    };
};
export declare const createIssue: (data: BHWFData) => Promise<BHWFData>;
export declare const attachScreenshots: (data: BHWFData) => Promise<void>;
export declare const attachLogFiles: (data: BHWFData) => Promise<void>;
