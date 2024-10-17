import { CreateNewIssueArgs, CreateNewIssueResponse } from "./types";
export declare const createNewIssue: ({ projectId, title, description, stepsToReproduce, }: CreateNewIssueArgs) => Promise<CreateNewIssueResponse>;
export declare const uploadScreenshot: ({ projectId, issueId, screenshot, }: {
    projectId: string;
    issueId: number;
    screenshot: Blob;
}) => Promise<any>;
export declare const uploadVideoClip: ({ projectId, issueId, videoClip, }: {
    projectId: string;
    issueId: number;
    videoClip: Blob;
}) => Promise<any>;
export declare const uploadLogFile: ({ projectId, issueId, logFile, }: {
    projectId: string;
    issueId: number;
    logFile: Blob;
}) => Promise<any>;
