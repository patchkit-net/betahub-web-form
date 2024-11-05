import { CreateNewIssueArgs, CreateNewIssueResponse, UploadLogFileArgs, UploadLogFileResponse, UploadScreenshotArgs, UploadScreenshotResponse, UploadVideoClipArgs, UploadVideoClipResponse } from "./types";
export declare const createNewIssue: ({ projectId, apiKey, title, description, stepsToReproduce, }: CreateNewIssueArgs) => Promise<CreateNewIssueResponse>;
export declare const uploadScreenshot: ({ projectId, apiKey, issueId, screenshot, }: UploadScreenshotArgs) => Promise<UploadScreenshotResponse>;
export declare const uploadVideoClip: ({ projectId, apiKey, issueId, videoClip, }: UploadVideoClipArgs) => Promise<UploadVideoClipResponse>;
export declare const uploadLogFile: ({ projectId, apiKey, issueId, logFile, }: UploadLogFileArgs) => Promise<UploadLogFileResponse>;
