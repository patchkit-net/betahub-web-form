import { CreateNewIssueArgs, CreateNewIssueResponse, UploadLogFileArgs, UploadLogFileResponse, UploadScreenshotArgs, UploadScreenshotResponse, UploadVideoClipArgs, UploadVideoClipResponse } from "./types";
export declare const createNewIssue: ({ projectId, title, description, stepsToReproduce }: CreateNewIssueArgs) => Promise<CreateNewIssueResponse>;
export declare const uploadScreenshot: ({ projectId, issueId, screenshot }: UploadScreenshotArgs) => Promise<UploadScreenshotResponse>;
export declare const uploadVideoClip: ({ projectId, issueId, videoClip }: UploadVideoClipArgs) => Promise<UploadVideoClipResponse>;
export declare const uploadLogFile: ({ projectId, issueId, logFile }: UploadLogFileArgs) => Promise<UploadLogFileResponse>;
