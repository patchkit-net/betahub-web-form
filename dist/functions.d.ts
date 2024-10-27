export declare const loadElement: (selector: string, parent?: ParentNode) => HTMLElement | null;
export declare const getInputElements: (parent: ParentNode | undefined, name: string) => {
    element: HTMLInputElement | undefined;
    errorMsgElement: HTMLElement | undefined;
};
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
export declare const createIssue: (data: any) => Promise<any>;
export declare const attachScreenshots: (data: any) => Promise<void>;
export declare const attachLogFiles: (data: any) => Promise<void>;
