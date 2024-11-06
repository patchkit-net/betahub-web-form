import { CreateNewIssueArgs, CreateNewIssueResponse, UploadLogFileArgs, UploadLogFileResponse, UploadScreenshotArgs, UploadScreenshotResponse, UploadVideoClipArgs, UploadVideoClipResponse } from "./types";
export declare const createNewIssue: ({ projectId, apiKey, title, description, stepsToReproduce, }: CreateNewIssueArgs) => Promise<CreateNewIssueResponse>;
export declare const uploadScreenshot: ({ projectId, apiKey, issueId, screenshot, onProgress, }: UploadScreenshotArgs & {
    onProgress?: (event: ProgressEvent) => void;
}) => Promise<UploadScreenshotResponse>;
export declare const uploadVideoClip: ({ projectId, apiKey, issueId, videoClip, onProgress, }: UploadVideoClipArgs & {
    onProgress?: (event: ProgressEvent) => void;
}) => Promise<UploadVideoClipResponse>;
export declare const uploadLogFile: ({ projectId, apiKey, issueId, logFile, onProgress, }: UploadLogFileArgs & {
    onProgress?: (event: ProgressEvent) => void;
}) => Promise<UploadLogFileResponse>;
