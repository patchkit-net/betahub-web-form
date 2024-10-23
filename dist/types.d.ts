export type CreateNewIssueArgs = {
    projectId: string;
    title?: string;
    description: string;
    stepsToReproduce?: string;
};
export type CreateNewIssueResponse = {
    assigned_to: {
        id: null | number;
        name: null | string;
    };
    created_at: string;
    description: string;
    id: number;
    potential_duplicate: null | CreateNewIssueResponse;
    priority: string;
    reported_by: {
        id: number;
        name: string;
    };
    score: string;
    status: string;
    steps_to_reproduce: Array<{
        step: string;
    }>;
    title: string;
    updated_at: string;
    url: string;
};
export type UploadScreenshotArgs = {
    projectId: string;
    issueId: number;
    screenshot: Blob;
};
export type UploadScreenshotResponse = {
    id: number;
    created_at: string;
    updated_at: string;
    status: number;
    description: null | string;
    issue_id: number;
    media_size_bytes: number;
};
export type UploadVideoClipArgs = {
    projectId: string;
    issueId: number;
    videoClip: Blob;
};
export type UploadVideoClipResponse = {
    id: number;
    created_at: string;
    updated_at: string;
    processing: boolean;
    processed: boolean;
    failed: boolean;
    media_size_bytes: number;
};
export type UploadLogFileArgs = {
    projectId: string;
    issueId: number;
    logFile: Blob;
};
export type UploadLogFileResponse = {
    id: number;
    created_at: string;
    updated_at: string;
    media_size_bytes: number;
};
